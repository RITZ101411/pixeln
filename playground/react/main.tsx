import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Pixeln } from "@pixeln/react";

function Demo() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: "flex", gap: 48, alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <Pixeln width={160} height={80} scale={7} gap={3} padding={5} bg="#1a1a2e">
        <h1 color="#4a90d9">Pixeln</h1>
        <p>pixel-native UI for the web</p>
        <p color="#ffffff">{`count: ${count}`}</p>
        <button bg="#e94560" padding={4} border="#ffffff" onClick={() => setCount(count + 1)}>+1</button>
        <small color="#888888">built with layout engine</small>
      </Pixeln>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Demo />);
