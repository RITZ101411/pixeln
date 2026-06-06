import React, { useRef, useEffect } from "react";
import { PixelBuffer, createNode, renderTree, Node } from "@pixeln/core";

export interface PixelCanvasProps {
  width: number;
  height: number;
  scale?: number;
  grid?: boolean;
  children?: React.ReactNode;
}

function childrenToNodes(children: React.ReactNode): Node[] {
  const nodes: Node[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const { children: nested, ...props } = child.props as any;
    const node = createNode(child.type as string, props, childrenToNodes(nested));
    nodes.push(node);
  });
  return nodes;
}

export function PixelCanvas({ width, height, scale = 1, grid = false, children }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const root = createNode("root", {}, childrenToNodes(children));
    const buffer = new PixelBuffer(width, height);
    renderTree(root, buffer);
    ctx.putImageData(buffer.toImageData(), 0, 0);
  }, [width, height, scale, grid, children]);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: width * scale,
    height: height * scale,
  };

  const canvasStyle: React.CSSProperties = {
    width: width * scale,
    height: height * scale,
    imageRendering: "pixelated" as any,
    display: "block",
  };

  const gridStyle: React.CSSProperties = grid && scale >= 4 ? {
    position: "absolute",
    inset: 0,
    backgroundSize: `${scale}px ${scale}px`,
    backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)`,
    pointerEvents: "none",
  } : { display: "none" };

  return React.createElement("div", { style: containerStyle },
    React.createElement("canvas", { ref: canvasRef, width, height, style: canvasStyle }),
    React.createElement("div", { style: gridStyle }),
  );
}
