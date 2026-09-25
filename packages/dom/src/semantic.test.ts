import { describe, expect, it, vi } from "vitest";
import { createSemanticOverlay, isSemanticAttribute } from "./semantic";

class FakeElement {
  textContent = "";
  style: Record<string, string> = {};
  attributes = new Map<string, string>();
  listeners = new Map<string, EventListener>();

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }

  removeAttribute(name: string) {
    this.attributes.delete(name);
  }

  addEventListener(name: string, listener: EventListenerOrEventListenerObject) {
    if (typeof listener === "function") this.listeners.set(name, listener);
  }

  click() {
    this.listeners.get("click")?.({} as Event);
  }
}

describe("semantic overlays", () => {
  it("allows common, accessibility, and tag-specific attributes", () => {
    expect(isSemanticAttribute("button", "disabled")).toBe(true);
    expect(isSemanticAttribute("button", "aria-label")).toBe(true);
    expect(isSemanticAttribute("a", "href")).toBe(true);
    expect(isSemanticAttribute("p", "href")).toBe(false);
    expect(isSemanticAttribute("button", "style")).toBe(false);
  });

  it("creates an interactive overlay with semantic attributes", () => {
    const onClick = vi.fn();
    const fakeElement = new FakeElement();
    const documentRef = {
      createElement: () => fakeElement as unknown as HTMLElement,
    };

    const overlay = createSemanticOverlay({
      tag: "button",
      text: "+1",
      attributes: {
        type: "button",
        disabled: true,
        "aria-label": "Increment count",
      },
      onClick,
    }, { x: 2, y: 3, w: 4, h: 5, scale: 6 }, documentRef as Pick<Document, "createElement">);

    expect(overlay.textContent).toBe("+1");
    expect(fakeElement.attributes.get("type")).toBe("button");
    expect(fakeElement.attributes.get("disabled")).toBe("");
    expect(fakeElement.attributes.get("aria-label")).toBe("Increment count");
    expect(fakeElement.style.left).toBe("12px");
    expect(fakeElement.style.top).toBe("18px");

    fakeElement.click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
