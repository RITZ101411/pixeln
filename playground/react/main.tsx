import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Pixeln } from "@pixeln/react";

function Demo() {
  const [count, setCount] = useState(0);

  return (
      <Pixeln width={200} height={80} scale={7} gap={3} padding={5} bg="#1a1a2e">
        <h1 color="#4a90d9">Pixeln</h1>
        <p>pixel-native UI for the web</p>
        <p color="#ffffff">{`count: ${count}`}</p>
        <button type="button" aria-label="Increment count" bg="#e94560" padding={4} border="#ffffff" onClick={() => setCount((current) => current + 1)}>
          +1
        </button>
        <small color="#888888">built with layout engine</small>
      </Pixeln>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Demo />);
