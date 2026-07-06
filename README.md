# Pixeln

pixel-native UI library for the modern web.

[日本語](README.ja.md)

## Packages

| Package | Description |
|---------|------------|
| `@pixeln/core` | Rendering engine — PixelBuffer, rasterizer, bitmap fonts, layout |
| `@pixeln/dom` | Web Component, semantic HTML → pixel rendering |
| `@pixeln/react` | React bindings |

## How It Works

```
HTML elements (h1, button, etc.)
  → Convert to layout nodes via bitmap font + tag config
  → Resolve pixel-level layout (vstack/hstack/padding/gap)
  → Rasterize into PixelBuffer
  → putImageData() to Canvas
  + Transparent DOM overlay for click/a11y
```

## License

MIT
