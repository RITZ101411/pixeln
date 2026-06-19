import React from "react";
import ReactDOM from "react-dom/client";
import { PixelCanvas } from "@pixeln/react";
import { layout, renderTree, PixelBuffer } from "@pixeln/core";

function App() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const root = layout({
      type: "vstack", gap: 3, children: [
        { type: "box", bg: "#4a90d9", border: "#fff", radius: 3, padding: 4, children: [
          { type: "text", content: "Pixeln", font: "8x8", color: "#000000" },
        ]},
        { type: "hstack", gap: 4, children: [
          { type: "box", bg: "#333", padding: 3, children: [
            { type: "text", content: "5x7", font: "5x7", color: "#e94560" },
          ]},
          { type: "box", bg: "#333", padding: 3, children: [
            { type: "text", content: "3x5", font: "3x5", color: "#00ff88" },
          ]},
        ]},
        { type: "text", content: "layout engine!", font: "8x8", color: "#aaaaaa" },
      ]
    }, 4, 4);

    const width = 80, height = 48;
    const buffer = new PixelBuffer(width, height);
    renderTree(root, buffer);
    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(buffer.toImageData(), 0, 0);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={48}
      style={{ width: 640, height: 384, imageRendering: "pixelated" as any }}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
