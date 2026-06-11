export function createContainer(width: number, height: number, scale: number): HTMLDivElement {
  const el = document.createElement("div");
  el.style.position = "relative";
  el.style.width = `${width * scale}px`;
  el.style.height = `${height * scale}px`;
  return el;
}
