import React from "react";
import ReactDOM from "react-dom/client";
import { PixelCanvas } from "@pixeln/renderer";

function App() {
  return (
    <div>
      <h1>Pixeln Playground</h1>
      <PixelCanvas width={64} height={64} scale={12} grid>
        <box x={0} y={0} w={64} h={64} bg="#1a1a2e" />
        <box x={2} y={2} w={1} h={8} bg="red" />
        <box x={12} y={4} w={6} h={6} bg="blue" />
        <box x={13} y={5} w={4} h={4} bg="white" />
        <pixel x={20} y={20} bg="yellow" />
        <pixel x={21} y={21} bg="cyan" />
        <pixel x={22} y={22} bg="magenta" />
      </PixelCanvas>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
