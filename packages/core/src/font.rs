use wasm_bindgen::prelude::*;

#[derive(Clone)]
pub struct BitmapFont {
    pub width: u8,
    pub height: u8,
    pub baseline: u8,
    pub spacing: u8,
    pub space_width: u8,
    glyphs: Vec<(u32, Vec<u8>)>,
}

impl BitmapFont {
    pub fn from_bytes(data: &[u8]) -> Option<Self> {
        if data.len() < 7 {
            return None;
        }

        let width = data[0];
        let height = data[1];
        let baseline = data[2];
        let spacing = data[3];
        let space_width = data[4];
        let glyph_count = u16::from_le_bytes([data[5], data[6]]) as usize;

        let mut offset = 7;
        let mut glyphs = Vec::with_capacity(glyph_count);

        for _ in 0..glyph_count {
            if offset + 4 + height as usize > data.len() {
                return None;
            }
            let codepoint = u32::from_le_bytes([
                data[offset],
                data[offset + 1],
                data[offset + 2],
                data[offset + 3],
            ]);
            offset += 4;
            let rows = data[offset..offset + height as usize].to_vec();
            offset += height as usize;
            glyphs.push((codepoint, rows));
        }

        Some(Self {
            width,
            height,
            baseline,
            spacing,
            space_width,
            glyphs,
        })
    }

    pub fn get_glyph(&self, ch: char) -> Option<&[u8]> {
        let cp = ch as u32;
        self.glyphs
            .iter()
            .find(|(c, _)| *c == cp)
            .map(|(_, rows)| rows.as_slice())
    }
}

static FONT_3X5: &[u8] = include_bytes!("../fonts/3x5.bin");
static FONT_5X7: &[u8] = include_bytes!("../fonts/5x7.bin");
static FONT_8X8: &[u8] = include_bytes!("../fonts/8x8.bin");

#[wasm_bindgen]
pub struct FontRegistry {
    fonts: Vec<(String, BitmapFont)>,
    default_name: String,
}

#[wasm_bindgen]
impl FontRegistry {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut registry = Self {
            fonts: Vec::new(),
            default_name: "5x7".to_string(),
        };
        if let Some(f) = BitmapFont::from_bytes(FONT_3X5) {
            registry.fonts.push(("3x5".to_string(), f));
        }
        if let Some(f) = BitmapFont::from_bytes(FONT_5X7) {
            registry.fonts.push(("5x7".to_string(), f));
        }
        if let Some(f) = BitmapFont::from_bytes(FONT_8X8) {
            registry.fonts.push(("8x8".to_string(), f));
        }
        registry
    }

    #[wasm_bindgen(js_name = "registerFont")]
    pub fn register_font(&mut self, name: &str, data: &[u8]) -> bool {
        if let Some(font) = BitmapFont::from_bytes(data) {
            self.fonts.retain(|(n, _)| n != name);
            self.fonts.push((name.to_string(), font));
            true
        } else {
            false
        }
    }

    #[wasm_bindgen(js_name = "setDefaultFont")]
    pub fn set_default_font(&mut self, name: &str) {
        self.default_name = name.to_string();
    }

    #[wasm_bindgen(js_name = "getFontNames")]
    pub fn get_font_names(&self) -> Vec<String> {
        self.fonts.iter().map(|(n, _)| n.clone()).collect()
    }
}

impl FontRegistry {
    pub fn get_font(&self, name: Option<&str>) -> Option<&BitmapFont> {
        let target = name.unwrap_or(&self.default_name);
        self.fonts
            .iter()
            .find(|(n, _)| n == target)
            .map(|(_, f)| f)
    }
}
