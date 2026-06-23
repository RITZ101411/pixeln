import React from "react";
import ReactDOM from "react-dom/client";
import { Pixeln } from "@pixeln/react";

function App() {
  return (
    <Pixeln width={128} height={64} scale={6} gap={3} padding={4} bg="#1a1a2e">
      <h1 color="#4a90d9">Pixeln</h1>
      <p>pixel-native UI for the web</p>
      <button bg="#e94560" padding={4} border="#ffffff" onClick={() => alert("clicked!")}>Click me</button>
      <small>built with layout engine</small>
    </Pixeln>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
