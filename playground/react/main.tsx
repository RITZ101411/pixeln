import React from "react";
import ReactDOM from "react-dom/client";
import { PixelCanvas } from "@pixeln/react";

function App() {
  return (
    <PixelCanvas width={80} height={48} scale={8}>
      <box x={4} y={4} w={72} h={12} bg="#4a90d9" radius={3} />
      <ptext x={8} y={7} content="3x5 Tom Thumb" color="#ffffff" font="3x5" />
      <box x={4} y={19} w={72} h={12} bg="#333333" radius={3} />
      <ptext x={8} y={22} content="5x7 Default" color="#e94560" font="5x7" />
      <box x={4} y={34} w={72} h={12} bg="#1a1a2e" radius={3} />
      <ptext x={8} y={36} content="8x8 Big" color="#00ff88" font="8x8" />
    </PixelCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
