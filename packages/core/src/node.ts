import { PixelBuffer } from "./PixelBuffer";
import { parseColor } from "./color";
import type { BoxProps, PixelProps } from "./nodeTypes";

export function renderBox(props: BoxProps, buffer: PixelBuffer, x: number, y: number) {
  if (props.bg != null) {
    buffer.fillRect(x, y, props.w ?? 0, props.h ?? 0, parseColor(props.bg));
  }
}

export function renderPixel(props: PixelProps, buffer: PixelBuffer, x: number, y: number) {
  if (props.bg != null) {
    buffer.set(x, y, parseColor(props.bg));
  }
}
