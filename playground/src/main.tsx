import React from "react";
import ReactDOM from "react-dom/client";
import { PixelCanvas } from "@pixeln/react";

function App() {
  return (
    <PixelCanvas width={32} height={32} scale={10} grid>
      <box x={4} y={4} w={24} h={24} bg="#333" />
      <pcircle x={16} y={16} r={8} bg="#e94560" />
      <pixel x={16} y={16} bg="#fff" />
    </PixelCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
