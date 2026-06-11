export interface GridOptions {
  width: number;
  height: number;
  scale: number;
}

export function createGrid({ width, height, scale }: GridOptions): HTMLDivElement {
  const el = document.createElement("div");
  el.dataset.pixelnGrid = "";
  el.style.position = "absolute";
  el.style.inset = "0";
  el.style.pointerEvents = "none";
  if (scale >= 4) {
    el.style.backgroundSize = `${scale}px ${scale}px`;
    el.style.backgroundImage = `linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)`;
  } else {
    el.style.display = "none";
  }
  return el;
}