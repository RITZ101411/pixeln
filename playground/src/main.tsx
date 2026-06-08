import React from "react";
import ReactDOM from "react-dom/client";
import { PixelCanvas, Button } from "@pixeln/renderer";

function App() {
  return (
    <div>
      <h1 style={{ color: "#fff", fontFamily: "monospace" }}>Pixeln Playground</h1>
      <PixelCanvas width={32} height={32} scale={12} grid>
        <box x={0} y={0} w={32} h={32} bg="#350025" />
        <Button x={4} y={12} w={12} h={6} bg="blue" onClick={() => alert("Clicked!")} />
        <pixel x={20} y={20} bg="yellow" />
      </PixelCanvas>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
