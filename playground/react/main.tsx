import React from "react";
import ReactDOM from "react-dom/client";
import { PixelCanvas } from "@pixeln/react";

function App() {
  return (
    <PixelCanvas width={64} height={64} scale={10} grid>
      <box x={4} y={4} w={40} h={24} bg="#4a90d9" radius={8} />
      <box x={8} y={8} w={32} h={16} bg="#e94560" radius={4} />
    </PixelCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
