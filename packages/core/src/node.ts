import { PixelBuffer } from "./PixelBuffer";
import { parseColor } from "./color";
import type { BoxProps, PixelProps, CircleProps } from "./nodeTypes";

function computeInsets(r: number): number[] {
  const maxX = new Array(r + 1).fill(0);
  let x = r, y = 0, d = 1 - r;
  while (x >= y) {
    maxX[y] = Math.max(maxX[y], x);
    maxX[x] = Math.max(maxX[x], y);
    y++;
    if (d < 0) d += 2 * y + 1;
    else { x--; d += 2 * (y - x) + 1; }
  }
  const insets = new Array(r);
  for (let py = 0; py < r; py++) {
    insets[py] = r - maxX[r - py];
  }
  return insets;
}

export function renderBox(props: BoxProps, buffer: PixelBuffer, x: number, y: number) {
  if (props.bg == null) return;
  const w = props.w ?? 0;
  const h = props.h ?? 0;
  const r = props.radius ?? 0;
  const color = parseColor(props.bg);

  if (r <= 0) {
    buffer.fillRect(x, y, w, h, color);
    return;
  }

  const insets = computeInsets(r);

  for (let py = 0; py < h; py++) {
    let x0 = 0;
    let x1 = w;

    if (py < r) {
      const inset = insets[py];
      x0 = inset;
      x1 = w - inset;
    } else if (py >= h - r) {
      const inset = insets[h - 1 - py];
      x0 = inset;
      x1 = w - inset;
    }

    buffer.fillRect(x + x0, y + py, x1 - x0, 1, color);
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
