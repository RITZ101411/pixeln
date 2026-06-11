import React from "react";
import { Overlay } from "../Overlay";

export interface ButtonProps {
  x: number;
  y: number;
  w: number;
  h: number;
  bg?: string | number;
  onClick?: () => void;
}

const transparentStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

export function Button({ x, y, w, h, bg = "blue", onClick }: ButtonProps) {
  return (
    <>
      <box x={x} y={y} w={w} h={h} bg={bg} />
      <Overlay x={x} y={y} w={w} h={h}>
        <button onClick={onClick} style={transparentStyle} />
      </Overlay>
    </>
  );
}
