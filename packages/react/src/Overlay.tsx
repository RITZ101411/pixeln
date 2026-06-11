import React from "react";
import { applyOverlayPosition } from "@pixeln/dom";
import { usePixel } from "./context";

export interface OverlayProps {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: React.ReactNode;
}

export function Overlay({ x, y, w, h, children }: OverlayProps) {
  const { scale } = usePixel();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) applyOverlayPosition(ref.current, { x, y, w, h, scale });
  }, [x, y, w, h, scale]);

  return React.createElement("div", { ref, "data-pixeln-overlay": true }, children);
}

Overlay._isOverlay = true;
