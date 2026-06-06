export class PixelBuffer {
  readonly width: number;
  readonly height: number;
  readonly data: Uint32Array;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint32Array(width * height);
  }

  set(x: number, y: number, color: number) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.data[y * this.width + x] = color;
    }
  }

  get(x: number, y: number): number {
    return this.data[y * this.width + x] ?? 0;
  }

  clear() {
    this.data.fill(0);
  }

  fillRect(x: number, y: number, w: number, h: number, color: number) {
    const x0 = Math.max(0, x);
    const y0 = Math.max(0, y);
    const x1 = Math.min(this.width, x + w);
    const y1 = Math.min(this.height, y + h);
    for (let py = y0; py < y1; py++) {
      const offset = py * this.width;
      for (let px = x0; px < x1; px++) {
        this.data[offset + px] = color;
      }
    }
  }

  toImageData(): ImageData {
    const rgba = new Uint8ClampedArray(this.data.length * 4);
    for (let i = 0; i < this.data.length; i++) {
      const c = this.data[i];
      const j = i * 4;
      rgba[j] = (c >>> 24) & 0xff;     // R
      rgba[j + 1] = (c >>> 16) & 0xff; // G
      rgba[j + 2] = (c >>> 8) & 0xff;  // B
      rgba[j + 3] = c & 0xff;          // A
    }
    return new ImageData(rgba, this.width, this.height);
  }
}
