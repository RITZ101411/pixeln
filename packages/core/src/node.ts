import { PixelBuffer } from "./PixelBuffer";
import { parseColor } from "./color";

export interface NodeProps {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  bg?: string | number;
}

export interface Node {
  type: string;
  props: NodeProps;
  children: Node[];
}

export function createNode(type: string, props: NodeProps = {}, children: Node[] = []): Node {
  return { type, props, children };
}

export function renderTree(node: Node, buffer: PixelBuffer, offsetX = 0, offsetY = 0) {
  const x = (node.props.x ?? 0) + offsetX;
  const y = (node.props.y ?? 0) + offsetY;

  if (node.type === "box" && node.props.bg != null) {
    const w = node.props.w ?? 0;
    const h = node.props.h ?? 0;
    buffer.fillRect(x, y, w, h, parseColor(node.props.bg));
  }

  if (node.type === "pixel" && node.props.bg != null) {
    buffer.set(x, y, parseColor(node.props.bg));
  }

  for (const child of node.children) {
    renderTree(child, buffer, x, y);
  }
}
