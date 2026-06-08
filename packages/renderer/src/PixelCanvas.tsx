import React, { useRef, useEffect } from "react";
import { PixelBuffer, createNode, renderTree, Node } from "@pixeln/core";
import { PixelProvider } from "./context";
import { Overlay } from "./Overlay";

export interface PixelCanvasProps {
  width: number;
  height: number;
  scale?: number;
  grid?: boolean;
  children?: React.ReactNode;
}

function flattenChildren(children: React.ReactNode): React.ReactElement[] {
  const result: React.ReactElement[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === React.Fragment) {
      result.push(...flattenChildren((child.props as any).children));
    } else if (typeof child.type === "function" && !(child.type as any)._isOverlay) {
      const rendered = (child.type as Function)(child.props);
      result.push(...flattenChildren(rendered));
    } else {
      result.push(child);
    }
  });
  return result;
}

export function PixelCanvas({ width, height, scale = 1, grid = false, children }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flat = flattenChildren(children);

  const pixelElements = flat.filter((el) => typeof el.type === "string");
  const overlayElements = flat.filter((el) => (el.type as any)?._isOverlay);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const nodes: Node[] = pixelElements.map((el) => {
      const { children: nested, ...props } = el.props as any;
      return createNode(el.type as string, props, nested ? buildNodes(nested) : []);
    });

    const root = createNode("root", {}, nodes);
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

  return React.createElement(PixelProvider, { value: { scale } },
    React.createElement("div", { style: containerStyle },
      React.createElement("canvas", { ref: canvasRef, width, height, style: canvasStyle }),
      React.createElement("div", { style: gridStyle }),
      ...overlayElements,
    ),
  );
}

function buildNodes(children: React.ReactNode): Node[] {
  const nodes: Node[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (typeof child.type !== "string") return;
    const { children: nested, ...props } = child.props as any;
    nodes.push(createNode(child.type, props, nested ? buildNodes(nested) : []));
  });
  return nodes;
}
