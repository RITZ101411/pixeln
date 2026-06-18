import React from "react";
import ReactDOM from "react-dom/client";
import { PixelCanvas } from "@pixeln/react";

function App() {
  return (
    <PixelCanvas width={80} height={48} scale={8}>
      <box x={4} y={4} w={72} h={18} bg="#4a90d9" radius={3} />
      <ptext x={22} y={9} content="Hello!" color="#ffffff" />
      <box x={4} y={26} w={72} h={14} bg="#333333" radius={6} />
      <ptext x={11} y={29} content="Packages" color="#e94560" font="8x8" />
    </PixelCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
