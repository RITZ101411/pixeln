import React from "react";
import ReactDOM from "react-dom/client";
import { PixelCanvas, Overlay } from "@pixeln/renderer";

function App() {
  return (
    <div style={{ padding: 20, background: "#222" }}>
      <h1 style={{ color: "#fff", fontFamily: "monospace" }}>Pixeln Playground</h1>
      <PixelCanvas width={32} height={32} scale={12} grid>
        <box x={0} y={0} w={32} h={32} bg="#1a1a2e" />
        <box x={4} y={12} w={12} h={6} bg="blue" />
        <pixel x={20} y={20} bg="yellow" />

        <Overlay x={4} y={12} w={12} h={6} scale={12}>
          <button
            onClick={() => alert("Clicked!")}
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          />
        </Overlay>
      </PixelCanvas>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
