export interface OverlayOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  scale: number;
}

export function createOverlay(opts: OverlayOptions): HTMLDivElement {
  const el = document.createElement("div");
  el.dataset.pixelnOverlay = "";
  applyOverlayPosition(el, opts);
  return el;
}

export function applyOverlayPosition(el: HTMLElement, { x, y, w, h, scale }: OverlayOptions) {
  el.style.position = "absolute";
  el.style.left = `${x * scale}px`;
  el.style.top = `${y * scale}px`;
  el.style.width = `${w * scale}px`;
  el.style.height = `${h * scale}px`;
}