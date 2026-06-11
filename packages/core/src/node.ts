import { PixelBuffer } from "./PixelBuffer";
import { parseColor } from "./color";
import type { BoxProps, PixelProps, CircleProps } from "./nodeTypes";

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

export function renderCircle(props: CircleProps, buffer: PixelBuffer, cx: number, cy: number) {
  if (props.bg == null) return;
  const color = parseColor(props.bg);
  const r = props.r;
  const fill = props.fill !== false;

  let x = r;
  let y = 0;
  let d = 1 - r;

  while (x >= y) {
    if (fill) {
      buffer.fillRect(cx - x, cy + y, x * 2 + 1, 1, color);
      buffer.fillRect(cx - x, cy - y, x * 2 + 1, 1, color);
      buffer.fillRect(cx - y, cy + x, y * 2 + 1, 1, color);
      buffer.fillRect(cx - y, cy - x, y * 2 + 1, 1, color);
    } else {
      buffer.set(cx + x, cy + y, color);
      buffer.set(cx - x, cy + y, color);
      buffer.set(cx + x, cy - y, color);
      buffer.set(cx - x, cy - y, color);
      buffer.set(cx + y, cy + x, color);
      buffer.set(cx - y, cy + x, color);
      buffer.set(cx + y, cy - x, color);
      buffer.set(cx - y, cy - x, color);
    }
    y++;
    if (d < 0) {
      d += 2 * y + 1;
    } else {
      x--;
      d += 2 * (y - x) + 1;
    }
  }
}
