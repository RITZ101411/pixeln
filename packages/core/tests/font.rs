use pixeln_core::{BitmapFont, FontRegistry, PixelBuffer, render_text};

#[test]
fn test_load_builtin_fonts() {
    let registry = FontRegistry::new();
    let names = registry.get_font_names();
    assert!(names.contains(&"3x5".to_string()));
    assert!(names.contains(&"5x7".to_string()));
    assert!(names.contains(&"8x8".to_string()));
}

#[test]
fn test_get_font() {
    let registry = FontRegistry::new();
    let font = registry.get_font(Some("3x5")).unwrap();
    assert_eq!(font.width, 3);
    assert_eq!(font.height, 5);
    assert_eq!(font.baseline, 4);
}

#[test]
fn test_default_font() {
    let registry = FontRegistry::new();
    let font = registry.get_font(None).unwrap();
    assert_eq!(font.width, 5);
    assert_eq!(font.height, 7);
}

#[test]
fn test_glyph_lookup() {
    let registry = FontRegistry::new();
    let font = registry.get_font(Some("3x5")).unwrap();
    assert!(font.get_glyph('A').is_some());
    assert!(font.get_glyph('z').is_some());
    assert!(font.get_glyph(' ').is_some());
}

#[test]
fn test_render_text_basic() {
    let registry = FontRegistry::new();
    let font = registry.get_font(Some("3x5")).unwrap();
    let mut buf = PixelBuffer::new(32, 8);
    let width = render_text(&mut buf, font, "A", 0, 0, 0xFFFFFFFF);
    assert!(width > 0);
    // 'A' in 3x5 font should have some pixels set
    let mut has_pixel = false;
    for y in 0..5 {
        for x in 0..3 {
            if buf.get(x, y) != 0 {
                has_pixel = true;
            }
        }
    }
    assert!(has_pixel);
}

#[test]
fn test_render_text_space() {
    let registry = FontRegistry::new();
    let font = registry.get_font(Some("3x5")).unwrap();
    let mut buf = PixelBuffer::new(64, 8);
    let width_no_space = render_text(&mut buf, font, "AB", 0, 0, 0xFFFFFFFF);
    buf.clear();
    let width_with_space = render_text(&mut buf, font, "A B", 0, 0, 0xFFFFFFFF);
    assert!(width_with_space > width_no_space);
}

#[test]
fn test_render_text_empty() {
    let registry = FontRegistry::new();
    let font = registry.get_font(Some("3x5")).unwrap();
    let mut buf = PixelBuffer::new(32, 8);
    let width = render_text(&mut buf, font, "", 0, 0, 0xFFFFFFFF);
    assert_eq!(width, 0);
}

#[test]
fn test_from_bytes_invalid() {
    assert!(BitmapFont::from_bytes(&[]).is_none());
    assert!(BitmapFont::from_bytes(&[0, 0, 0]).is_none());
}
