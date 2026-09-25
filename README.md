# Pixeln

Pixel-native UI rendering for the web.

Pixeln takes a small set of semantic HTML elements, lays them out on an integer pixel grid, and rasterizes the result to Canvas. A transparent DOM overlay keeps supported elements interactive and accessible.

[日本語](README.ja.md)

> Pixeln is currently a prototype. The HTML and React adapters intentionally support a narrow set of direct child elements.

## Packages

| Package | Description |
|---------|-------------|
| `@pixeln/core` | Pixel buffer, bitmap fonts, layout nodes, and rasterization |
| `@pixeln/dom` | DOM renderer and `<pixeln-canvas>` custom element |
| `@pixeln/react` | React bindings for `<Pixeln>` |

## How it works

```text
Supported direct child elements (h1, p, button, ...)
  → Convert to SemanticChild values using TAG_CONFIG
  → Resolve a pixel-level vertical stack (vstack)
  → Rasterize into PixelBuffer
  → putImageData() to Canvas
  + Add generated transparent DOM overlays for interaction/a11y
```

The Canvas is the visual output. The overlay elements receive supported semantic attributes and click handlers. The current adapters do not preserve the original React element or arbitrary custom component DOM.

## React

```tsx
import { Pixeln } from "@pixeln/react";

export function Example() {
  return (
    <Pixeln width={200} height={80} scale={7} gap={3} padding={5} bg="#1a1a2e">
      <h1 color="#4a90d9">Pixeln</h1>
      <p>pixel-native UI for the web</p>
      <button type="button" aria-label="Start" bg="#e94560" padding={4}>
        Start
      </button>
    </Pixeln>
  );
}
```

React currently accepts these direct child tags: `h1`, `h2`, `h3`, `h4`, `p`, `span`, `button`, `a`, and `small`. Text children are supported. Nested elements and custom components are ignored by the semantic extractor.

Supported semantic attributes include common attributes such as `id`, `role`, `title`, `tabindex`, all `aria-*` and `data-*` attributes, plus tag-specific attributes for buttons and links.

## HTML custom element

```html
<pixeln-canvas width="128" height="64" scale="6" gap="3" padding="4">
  <h1>Pixeln</h1>
  <p>pixel-native UI for the web</p>
  <button onclick="alert('clicked!')">Click me</button>
</pixeln-canvas>
```

Register the custom element once:

```ts
import { registerPixelnElement } from "@pixeln/dom";

registerPixelnElement();
```

## Core layout API

`@pixeln/core` also exposes low-level `text`, `box`, `vstack`, and `hstack` layout nodes. The semantic HTML adapters currently use only a top-level `vstack`; `hstack` is available for direct core consumers.

## License

MIT
