import React from "react";

export interface OverlayProps {
  x: number;
  y: number;
  w: number;
  h: number;
  scale: number;
  children?: React.ReactNode;
}

export function Overlay({ x, y, w, h, scale, children }: OverlayProps) {
  return React.createElement("div", {
    style: {
      position: "absolute",
      left: x * scale,
      top: y * scale,
      width: w * scale,
      height: h * scale,
    },
  }, children);
}
