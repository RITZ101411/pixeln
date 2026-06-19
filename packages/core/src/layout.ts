import { getFont } from "./font";
import type { Node } from "./nodeTypes";
import { createNode } from "./nodeTypes";

export interface LayoutText {
  type: "text";
  content: string;
  font?: string;
  color?: string | number;
}

export interface LayoutBox {
  type: "box";
  bg?: string | number;
  border?: string | number;
  radius?: number;
  padding?: number;
  children?: LayoutNode[];
}

export interface LayoutVStack {
  type: "vstack";
  gap?: number;
  children: LayoutNode[];
}

export interface LayoutHStack {
  type: "hstack";
  gap?: number;
  children: LayoutNode[];
}

export type LayoutNode = LayoutText | LayoutBox | LayoutVStack | LayoutHStack;

interface Rect { x: number; y: number; w: number; h: number; }

export function measureText(content: string, fontName?: string): { w: number; h: number } {
  const font = getFont(fontName);
  let w = 0;
  for (const char of content) {
    if (char === " ") {
      w += font.spaceWidth ?? font.width;
      continue;
    }
    const glyph = font.glyphs[char];
    if (glyph) {
      let maxCol = 0;
      for (let row = 0; row < font.height; row++) {
        const bits = glyph[row];
        for (let col = 0; col < font.width; col++) {
          if (bits & (1 << col)) {
            if (col > maxCol) maxCol = col;
          }
        }
      }
      w += maxCol + 1 + (font.spacing ?? 1);
    }
  }
  if (w > 0) w -= (font.spacing ?? 1);
  return { w, h: font.height };
}

function measure(node: LayoutNode): { w: number; h: number } {
  switch (node.type) {
    case "text":
      return measureText(node.content, node.font);
    case "box": {
      const p = node.padding ?? 0;
      if (!node.children || node.children.length === 0) return { w: p * 2, h: p * 2 };
      const inner = measure({ type: "vstack", gap: 0, children: node.children });
      return { w: inner.w + p * 2, h: inner.h + p * 2 };
    }
    case "vstack": {
      const gap = node.gap ?? 0;
      let w = 0, h = 0;
      for (let i = 0; i < node.children.length; i++) {
        const size = measure(node.children[i]);
        w = Math.max(w, size.w);
        h += size.h + (i > 0 ? gap : 0);
      }
      return { w, h };
    }
    case "hstack": {
      const gap = node.gap ?? 0;
      let w = 0, h = 0;
      for (let i = 0; i < node.children.length; i++) {
        const size = measure(node.children[i]);
        w += size.w + (i > 0 ? gap : 0);
        h = Math.max(h, size.h);
      }
      return { w, h };
    }
  }
}

function resolve(node: LayoutNode, x: number, y: number): Node[] {
  switch (node.type) {
    case "text":
      return [createNode("text", { x, y, content: node.content, color: node.color, font: node.font })];
    case "box": {
      const p = node.padding ?? 0;
      const size = measure(node);
      const nodes: Node[] = [];
      if (node.bg || node.border) {
        nodes.push(createNode("box", { x, y, w: size.w, h: size.h, bg: node.bg, border: node.border, radius: node.radius }));
      }
      if (node.children) {
        for (const child of resolve({ type: "vstack", gap: 0, children: node.children }, x + p, y + p)) {
          nodes.push(child);
        }
      }
      return nodes;
    }
    case "vstack": {
      const gap = node.gap ?? 0;
      const nodes: Node[] = [];
      let cy = y;
      for (const child of node.children) {
        nodes.push(...resolve(child, x, cy));
        cy += measure(child).h + gap;
      }
      return nodes;
    }
    case "hstack": {
      const gap = node.gap ?? 0;
      const nodes: Node[] = [];
      let cx = x;
      for (const child of node.children) {
        nodes.push(...resolve(child, cx, y));
        cx += measure(child).w + gap;
      }
      return nodes;
    }
  }
}

export function layout(root: LayoutNode, x = 0, y = 0): Node {
  const nodes = resolve(root, x, y);
  return createNode("root", {}, nodes);
}
