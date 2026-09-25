import React, { useRef, useEffect } from "react";
import { isSemanticAttribute, renderPixeln, TAG_CONFIG } from "@pixeln/dom";
import type { SemanticChild } from "@pixeln/dom";

export interface PixelnProps {
  width: number;
  height: number;
  scale?: number;
  gap?: number;
  padding?: number;
  bg?: string | number;
  children?: React.ReactNode;
}

function extractAttributes(tag: string, props: Record<string, unknown>) {
  const attributes: Record<string, string | number | boolean> = {};

  for (const [propName, value] of Object.entries(props)) {
    const attributeName = propName === "tabIndex" ? "tabindex" : propName;
    if (!isSemanticAttribute(tag, attributeName)) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      attributes[attributeName] = value;
    }
  }

  return attributes;
}

export function extractChildren(children: React.ReactNode): SemanticChild[] {
  const result: SemanticChild[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const tag = typeof child.type === "string" ? child.type : null;
    if (!tag || !TAG_CONFIG[tag]) return;
    const props = child.props as any;
    result.push({
      tag,
      text: typeof props.children === "string" ? props.children : "",
      attributes: extractAttributes(tag, props),
      font: props.font,
      color: props.color,
      bg: props.bg,
      border: props.border,
      radius: props.radius,
      padding: props.padding,
      onClick: props.onClick ?? null,
    });
  });
  return result;
}

export function Pixeln({ width, height, scale = 4, gap = 2, padding = 4, bg, children }: PixelnProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const semanticChildren = extractChildren(children);
    const { canvas, overlays } = renderPixeln({ width, height, scale, gap, padding, bg, children: semanticChildren });

    container.innerHTML = "";
    const overlayContainer = document.createElement("div");
    overlayContainer.style.position = "absolute";
    overlayContainer.style.inset = "0";
    overlayContainer.style.pointerEvents = "none";
    for (const ol of overlays) overlayContainer.appendChild(ol);

    container.appendChild(canvas);
    container.appendChild(overlayContainer);
  }, [width, height, scale, gap, padding, bg, children]);

  const style: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    width: width * scale,
    height: height * scale,
  };

  return React.createElement("div", { ref: containerRef, style });
}
