import React from "react";
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
  return React.createElement("div", {
    "data-pixeln-overlay": true,
    style: {
      position: "absolute",
      left: x * scale,
      top: y * scale,
      width: w * scale,
      height: h * scale,
    },
  }, children);
}

Overlay._isOverlay = true;
