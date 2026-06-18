import { PixelBuffer } from "./PixelBuffer";
import type { Node } from "./nodeTypes";
import { renderBox, renderPixel, renderCircle, renderText } from "./node";

export function renderTree(node: Node, buffer: PixelBuffer, offsetX = 0, offsetY = 0) {
  const x = (node.props.x ?? 0) + offsetX;
  const y = (node.props.y ?? 0) + offsetY;

  switch (node.type) {
    case "box":
      renderBox(node.props, buffer, x, y);
      break;
    case "pixel":
      renderPixel(node.props, buffer, x, y);
      break;
    case "pcircle":
      renderCircle(node.props, buffer, x, y);
      break;
    case "text":
      renderText(node.props, buffer, x, y);
      break;
  }

  for (const child of node.children) {
    renderTree(child, buffer, x, y);
  }
}
