# Pixeln

Web向けのピクセルネイティブUIレンダリングライブラリです。

HTML要素を入力として受け取り、整数ピクセル単位でレイアウトし、Canvasへラスタライズします。透明なDOM overlayを重ねることで、対応要素の操作性とアクセシビリティを維持します。

> Pixelnは現在プロトタイプです。HTML/Reactアダプターが対応するのは、直接の子要素にある限定されたタグだけです。

## パッケージ

| パッケージ | 説明 |
|------------|------|
| `@pixeln/core` | ピクセルバッファ、ビットマップフォント、レイアウトノード、ラスタライズ |
| `@pixeln/dom` | DOMレンダラーと`<pixeln-canvas>`カスタム要素 |
| `@pixeln/react` | `<Pixeln>`のReactバインディング |

## 仕組み

```text
対応済みの直接HTML要素 (h1, p, button, ...)
  → TAG_CONFIGを使ってSemanticChildへ変換
  → ピクセル単位の縦方向レイアウト (vstack) を解決
  → PixelBufferへラスタライズ
  → CanvasへputImageData()
  + 操作/a11y用の透明DOM overlayを生成
```

Canvasが見た目の出力を担当します。overlay要素が対応済みのセマンティック属性とクリックハンドラーを受け取ります。現在のアダプターは、元のReact要素や任意のカスタムコンポーネントのDOMをそのまま保持するものではありません。

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

Reactで現在対応している直接の子タグは、`h1`、`h2`、`h3`、`h4`、`p`、`span`、`button`、`a`、`small`です。テキストの子要素に対応しています。ネストした要素やカスタムコンポーネントはsemantic extractorから無視されます。

対応しているセマンティック属性は、`id`、`role`、`title`、`tabindex`、すべての`aria-*`/`data-*`属性に加え、buttonとlinkのタグ固有属性です。

## HTMLカスタム要素

```html
<pixeln-canvas width="128" height="64" scale="6" gap="3" padding="4">
  <h1>Pixeln</h1>
  <p>pixel-native UI for the web</p>
  <button onclick="alert('clicked!')">Click me</button>
</pixeln-canvas>
```

カスタム要素は一度だけ登録します。

```ts
import { registerPixelnElement } from "@pixeln/dom";

registerPixelnElement();
```

## CoreのレイアウトAPI

`@pixeln/core`は低レベルAPIとして、`text`、`box`、`vstack`、`hstack`のレイアウトノードも提供しています。semantic HTMLアダプターが現在使用するのはトップレベルの`vstack`だけで、`hstack`はCoreを直接利用する場合に使えます。

## ライセンス

MIT
