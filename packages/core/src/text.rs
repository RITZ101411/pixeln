use crate::font::BitmapFont;
use crate::pixel_buffer::PixelBuffer;

pub fn render_text(
    buffer: &mut PixelBuffer,
    font: &BitmapFont,
    content: &str,
    x: i32,
    y: i32,
    color: u32,
) -> u32 {
    let mut cx = x;

    for ch in content.chars() {
        if ch == ' ' {
            cx += font.space_width as i32;
            continue;
        }

        if let Some(glyph) = font.get_glyph(ch) {
            let mut max_col: i32 = 0;
            for row in 0..font.height as i32 {
                let bits = glyph[row as usize];
                for col in 0..font.width as i32 {
                    if bits & (1 << col) != 0 {
                        buffer.set_signed(cx + col, y + row, color);
                        if col > max_col {
                            max_col = col;
                        }
                    }
                }
            }
            cx += max_col + 1 + font.spacing as i32;
        }
    }

    (cx - x) as u32
}
