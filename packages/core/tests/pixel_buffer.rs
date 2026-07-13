use pixeln_core::PixelBuffer;

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
    buf.set(0, 0, 0xAABBCCDD);
    let rgba = buf.to_image_data();
    assert_eq!(rgba.len(), 4);
    assert_eq!(rgba[0], 0xAA);
    assert_eq!(rgba[1], 0xBB);
    assert_eq!(rgba[2], 0xCC);
    assert_eq!(rgba[3], 0xDD);
}
