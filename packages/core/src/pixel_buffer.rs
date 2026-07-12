use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct PixelBuffer {
    width: u32,
    height: u32,
    data: Vec<u32>,
}

#[wasm_bindgen]
impl PixelBuffer {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> Self {
        Self {
            width,
            height,
            data: vec![0; (width * height) as usize],
        }
    }

    #[wasm_bindgen(getter)]
    pub fn width(&self) -> u32 {
        self.width
    }

    #[wasm_bindgen(getter)]
    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn set(&mut self, x: u32, y: u32, color: u32) {
        if x < self.width && y < self.height {
            self.data[(y * self.width + x) as usize] = color;
        }
    }

    pub fn get(&self, x: u32, y: u32) -> u32 {
        if x < self.width && y < self.height {
            self.data[(y * self.width + x) as usize]
        } else {
            0
        }
    }

    pub fn clear(&mut self) {
        self.data.fill(0);
    }

    #[wasm_bindgen(js_name = "fillRect")]
    pub fn fill_rect(&mut self, x: i32, y: i32, w: i32, h: i32, color: u32) {
        let x0 = x.max(0) as u32;
        let y0 = y.max(0) as u32;
        let x1 = ((x + w).max(0) as u32).min(self.width);
        let y1 = ((y + h).max(0) as u32).min(self.height);
        for py in y0..y1 {
            let offset = (py * self.width) as usize;
            for px in x0..x1 {
                self.data[offset + px as usize] = color;
            }
        }
    }

    /// Returns RGBA pixel data as a Vec<u8> for use with ImageData on the JS side.
    #[wasm_bindgen(js_name = "toImageData")]
    pub fn to_image_data(&self) -> Vec<u8> {
        let mut rgba = vec![0u8; self.data.len() * 4];
        for (i, &c) in self.data.iter().enumerate() {
            let j = i * 4;
            rgba[j] = (c >> 24) as u8;     // R
            rgba[j + 1] = (c >> 16) as u8; // G
            rgba[j + 2] = (c >> 8) as u8;  // B
            rgba[j + 3] = c as u8;         // A
        }
        rgba
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new() {
        let buf = PixelBuffer::new(10, 20);
        assert_eq!(buf.width(), 10);
        assert_eq!(buf.height(), 20);
        assert_eq!(buf.get(0, 0), 0);
    }

    #[test]
    fn test_set_get() {
        let mut buf = PixelBuffer::new(4, 4);
        buf.set(2, 3, 0xFF0000FF);
        assert_eq!(buf.get(2, 3), 0xFF0000FF);
        assert_eq!(buf.get(0, 0), 0);
    }

    #[test]
    fn test_set_out_of_bounds() {
        let mut buf = PixelBuffer::new(4, 4);
        buf.set(5, 5, 0xFFFFFFFF);
        // Should not panic, just no-op
        assert_eq!(buf.get(3, 3), 0);
    }

    #[test]
    fn test_get_out_of_bounds() {
        let buf = PixelBuffer::new(4, 4);
        assert_eq!(buf.get(10, 10), 0);
    }

    #[test]
    fn test_clear() {
        let mut buf = PixelBuffer::new(4, 4);
        buf.set(1, 1, 0x12345678);
        buf.clear();
        assert_eq!(buf.get(1, 1), 0);
    }

    #[test]
    fn test_fill_rect() {
        let mut buf = PixelBuffer::new(8, 8);
        buf.fill_rect(2, 2, 3, 3, 0xAABBCCDD);
        assert_eq!(buf.get(2, 2), 0xAABBCCDD);
        assert_eq!(buf.get(4, 4), 0xAABBCCDD);
        assert_eq!(buf.get(5, 5), 0);
        assert_eq!(buf.get(1, 1), 0);
    }

    #[test]
    fn test_fill_rect_clipping() {
        let mut buf = PixelBuffer::new(4, 4);
        buf.fill_rect(-1, -1, 3, 3, 0x11223344);
        assert_eq!(buf.get(0, 0), 0x11223344);
        assert_eq!(buf.get(1, 1), 0x11223344);
        assert_eq!(buf.get(2, 2), 0);
    }

    #[test]
    fn test_to_image_data() {
        let mut buf = PixelBuffer::new(1, 1);
        // Color: 0xAABBCCDD -> R=0xAA, G=0xBB, B=0xCC, A=0xDD
        buf.set(0, 0, 0xAABBCCDD);
        let rgba = buf.to_image_data();
        assert_eq!(rgba.len(), 4);
        assert_eq!(rgba[0], 0xAA); // R
        assert_eq!(rgba[1], 0xBB); // G
        assert_eq!(rgba[2], 0xCC); // B
        assert_eq!(rgba[3], 0xDD); // A
    }
}
