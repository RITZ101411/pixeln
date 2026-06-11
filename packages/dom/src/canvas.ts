import { PixelBuffer, renderTree, Node } from "@pixeln/core";

export interface CanvasOptions {
  width: number;
  height: number;
  scale: number;
}

export function createPixelCanvas(opts: CanvasOptions): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = opts.width;
  canvas.height = opts.height;
  applyCanvasStyle(canvas, opts);
  return canvas;
}

export function applyCanvasStyle(canvas: HTMLCanvasElement, { width, height, scale }: CanvasOptions) {
  canvas.style.width = `${width * scale}px`;
  canvas.style.height = `${height * scale}px`;
  canvas.style.imageRendering = "pixelated";
  canvas.style.display = "block";
}

export function renderToCanvas(canvas: HTMLCanvasElement, root: Node, width: number, height: number) {
  const ctx = canvas.getContext("2d")!;
  const buffer = new PixelBuffer(width, height);
  renderTree(root, buffer);
  ctx.putImageData(buffer.toImageData(), 0, 0);
}