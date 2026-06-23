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
  font?: string;
  color?: string;
  bg?: string;
  border?: string;
  radius?: number;
  padding?: number;
  onClick?: (() => void) | null;
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

    const el = document.createElement(child.tag);
    el.textContent = child.text;
    applyOverlayPosition(el, { x: padding, y: cy, w: elW, h: elH, scale });
    el.style.color = "transparent";
    el.style.fontSize = "0";
    el.style.margin = "0";
    el.style.padding = "0";
    el.style.border = "none";
    el.style.background = "transparent";
    el.style.cursor = child.tag === "button" || child.tag === "a" ? "pointer" : "default";
    el.style.pointerEvents = "auto";

    if (child.onClick) {
      el.addEventListener("click", child.onClick);
    }

    overlays.push(el);
    cy += elH + gap;
  }

  return { canvas, overlays };
}
