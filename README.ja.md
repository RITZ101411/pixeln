# Pixeln

モダンWeb向けのピクセルネイティブUIライブラリ。

## Packages

| Package | Description |
|---------|------------|
| `@pixeln/core` | 描画エンジン — PixelBuffer, ラスタライザ, ビットマップフォント, レイアウト |
| `@pixeln/dom` | Web Component, セマンティックHTML→ピクセル変換 |
| `@pixeln/react` | React バインディング |

## How It Works

```
HTML要素 (h1, button, etc.)
  → ビットマップフォント + タグ設定でレイアウトノードに変換
  → ピクセル単位でレイアウト解決 (vstack/hstack/padding/gap)
  → PixelBuffer にラスタライズ
  → Canvas に putImageData()
  + 透明DOM要素をオーバーレイ (クリック/a11y)
```

## License

MIT
