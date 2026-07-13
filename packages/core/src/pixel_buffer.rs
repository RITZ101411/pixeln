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

impl PixelBuffer {
    pub fn set_signed(&mut self, x: i32, y: i32, color: u32) {
        if x >= 0 && y >= 0 {
            self.set(x as u32, y as u32, color);
        }
    }
}

