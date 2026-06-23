import { renderPixeln, TAG_CONFIG } from "./semantic";
import type { SemanticChild } from "./semantic";

export class PixelnCanvas extends HTMLElement {
  private wrapper: HTMLDivElement | null = null;

  static get observedAttributes() {
    return ["width", "height", "scale", "gap", "padding", "bg"];
  }

  get pixelWidth() { return parseInt(this.getAttribute("width") ?? "128"); }
  get pixelHeight() { return parseInt(this.getAttribute("height") ?? "64"); }
  get scale() { return parseInt(this.getAttribute("scale") ?? "4"); }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.wrapper) this.render();
  }

  private render() {
    const w = this.pixelWidth;
    const h = this.pixelHeight;
    const scale = this.scale;
    const gap = parseInt(this.getAttribute("gap") ?? "2");
    const padding = parseInt(this.getAttribute("padding") ?? "4");

    const children: SemanticChild[] = [];
    for (const el of Array.from(this.children)) {
      const tag = el.tagName.toLowerCase();
      if (!TAG_CONFIG[tag]) continue;
      children.push({
        tag,
        text: el.textContent ?? "",
        font: el.getAttribute("data-font") ?? undefined,
        color: el.getAttribute("data-color") ?? undefined,
        bg: el.getAttribute("data-bg") ?? undefined,
        border: el.getAttribute("data-border") ?? undefined,
        padding: el.getAttribute("data-padding") ? parseInt(el.getAttribute("data-padding")!) : undefined,
        onClick: (el as HTMLElement).onclick ? () => (el as HTMLElement).click() : null,
      });
    }

    const { canvas, overlays } = renderPixeln({ width: w, height: h, scale, gap, padding, bg: this.getAttribute("bg") ?? undefined, children });

    const shadow = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    shadow.innerHTML = "";

    this.wrapper = document.createElement("div");
    this.wrapper.style.position = "relative";
    this.wrapper.style.display = "inline-block";
    this.wrapper.style.width = `${w * scale}px`;
    this.wrapper.style.height = `${h * scale}px`;

    const overlayContainer = document.createElement("div");
    overlayContainer.style.position = "absolute";
    overlayContainer.style.inset = "0";
    overlayContainer.style.pointerEvents = "none";

    for (const ol of overlays) overlayContainer.appendChild(ol);

    this.wrapper.appendChild(canvas);
    this.wrapper.appendChild(overlayContainer);
    shadow.appendChild(this.wrapper);
  }
}

export function registerPixelnElement() {
  if (!customElements.get("pixeln-canvas")) {
    customElements.define("pixeln-canvas", PixelnCanvas);
  }
}
