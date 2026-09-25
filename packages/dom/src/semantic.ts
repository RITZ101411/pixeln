import { PixelBuffer, renderTree, layout, measureText, parseColor } from "@pixeln/core";
import type { LayoutNode } from "@pixeln/core";
import { applyOverlayPosition } from "./overlay";

export interface TagConfig {
  font: string;
  color: string;
}

export const TAG_CONFIG: Record<string, TagConfig> = {
  h1: { font: "8x8", color: "#ffffff" },
  h2: { font: "8x8", color: "#cccccc" },
  h3: { font: "5x7", color: "#ffffff" },
  h4: { font: "5x7", color: "#cccccc" },
  p: { font: "5x7", color: "#aaaaaa" },
  span: { font: "5x7", color: "#aaaaaa" },
  button: { font: "5x7", color: "#ffffff" },
  a: { font: "5x7", color: "#4a90d9" },
  small: { font: "3x5", color: "#888888" },
};

export interface SemanticChild {
  tag: string;
  text: string;
  attributes?: Record<string, string | number | boolean>;
  font?: string;
  color?: string;
  bg?: string;
  border?: string;
  radius?: number;
  padding?: number;
  onClick?: (() => void) | null;
}

const COMMON_ATTRIBUTES = new Set(["id", "role", "title", "tabindex"]);
const TAG_ATTRIBUTES: Record<string, Set<string>> = {
  button: new Set(["type", "disabled", "name", "value"]),
  a: new Set(["href", "target", "rel", "download"]),
};

export function isSemanticAttribute(tag: string, name: string): boolean {
  const normalized = name.toLowerCase();
  return COMMON_ATTRIBUTES.has(normalized)
    || TAG_ATTRIBUTES[tag]?.has(normalized) === true
    || normalized.startsWith("aria-")
    || normalized.startsWith("data-");
}

export function applySemanticAttributes(
  element: HTMLElement,
  attributes: SemanticChild["attributes"],
) {
  if (!attributes) return;

  for (const [name, value] of Object.entries(attributes)) {
    if (value === false) {
      element.removeAttribute(name);
    } else if (value === true) {
      element.setAttribute(name, "");
    } else {
      element.setAttribute(name, String(value));
    }
  }
}

export interface SemanticOverlayOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  scale: number;
}

export function createSemanticOverlay(
  child: SemanticChild,
  options: SemanticOverlayOptions,
  documentRef: Pick<Document, "createElement"> = document,
): HTMLElement {
  const element = documentRef.createElement(child.tag);
  element.textContent = child.text;
  applySemanticAttributes(element, child.attributes);
  applyOverlayPosition(element, options);
  element.style.color = "transparent";
  element.style.fontSize = "0";
  element.style.margin = "0";
  element.style.padding = "0";
  element.style.border = "none";
  element.style.background = "transparent";
  const disabled = child.attributes?.disabled === true
    || child.attributes?.disabled === ""
    || child.attributes?.disabled === "disabled";
  element.style.cursor = disabled
    ? "default"
    : child.tag === "button" || child.tag === "a" ? "pointer" : "default";
  element.style.pointerEvents = "auto";

  if (child.onClick) {
    element.addEventListener("click", child.onClick);
  }

  return element;
}

export function childrenToLayout(children: SemanticChild[], gap: number): LayoutNode {
  const nodes: LayoutNode[] = [];
  for (const child of children) {
    const config = TAG_CONFIG[child.tag];
    if (!config) continue;
    const font = child.font ?? config.font;
    const color = child.color ?? config.color;

    if (child.bg || child.border || child.padding != null) {
      nodes.push({
        type: "box",
        bg: child.bg,
        border: child.border,
        radius: child.radius,
        padding: child.padding ?? 3,
        children: [{ type: "text", content: child.text, font, color }],
      });
    } else {
      nodes.push({ type: "text", content: child.text, font, color });
    }
  }
  return { type: "vstack", gap, children: nodes };
}

export interface RenderPixelnOptions {
  width: number;
  height: number;
  scale: number;
  gap?: number;
  padding?: number;
  bg?: string | number;
  children: SemanticChild[];
}

export interface RenderPixelnResult {
  canvas: HTMLCanvasElement;
  overlays: HTMLElement[];
}

export function renderPixeln(opts: RenderPixelnOptions): RenderPixelnResult {
  const { width, height, scale, gap = 2, padding = 4, bg, children } = opts;

  const layoutTree = childrenToLayout(children, gap);
  const root = layout(layoutTree, padding, padding);

  const buffer = new PixelBuffer(width, height);
  if (bg) {
    buffer.fillRect(0, 0, width, height, parseColor(bg));
  }
  renderTree(root, buffer);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width * scale}px`;
  canvas.style.height = `${height * scale}px`;
  canvas.style.imageRendering = "pixelated";
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d")!;
  ctx.putImageData(buffer.toImageData(), 0, 0);

  const overlays: HTMLElement[] = [];
  let cy = padding;
  for (const child of children) {
    const config = TAG_CONFIG[child.tag];
    if (!config) continue;
    const font = child.font ?? config.font;
    const size = measureText(child.text, font);
    const p = child.bg || child.border || child.padding != null ? (child.padding ?? 3) : 0;
    const elH = size.h + p * 2;
    const elW = size.w + p * 2;

    overlays.push(createSemanticOverlay(child, {
      x: padding,
      y: cy,
      w: elW,
      h: elH,
      scale,
    }));
    cy += elH + gap;
  }

  return { canvas, overlays };
}
