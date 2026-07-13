use pixeln_core::parse_color;

#[test]
fn test_named_colors() {
    assert_eq!(parse_color("black"), 0x000000ff);
    assert_eq!(parse_color("white"), 0xffffffff);
    assert_eq!(parse_color("red"), 0xff0000ff);
    assert_eq!(parse_color("green"), 0x00ff00ff);
    assert_eq!(parse_color("blue"), 0x0000ffff);
    assert_eq!(parse_color("yellow"), 0xffff00ff);
    assert_eq!(parse_color("cyan"), 0x00ffffff);
    assert_eq!(parse_color("magenta"), 0xff00ffff);
    assert_eq!(parse_color("transparent"), 0x00000000);
}

#[test]
fn test_named_colors_case_insensitive() {
    assert_eq!(parse_color("Black"), 0x000000ff);
    assert_eq!(parse_color("RED"), 0xff0000ff);
    assert_eq!(parse_color("Transparent"), 0x00000000);
}

#[test]
fn test_hex_6_digits() {
    assert_eq!(parse_color("#ff0000"), 0xff0000ff);
    assert_eq!(parse_color("#00ff00"), 0x00ff00ff);
    assert_eq!(parse_color("#abcdef"), 0xabcdefff);
}

#[test]
fn test_hex_6_digits_no_hash() {
    assert_eq!(parse_color("ff0000"), 0xff0000ff);
}

#[test]
fn test_hex_8_digits() {
    assert_eq!(parse_color("#aabbccdd"), 0xaabbccdd);
    assert_eq!(parse_color("#00000000"), 0x00000000);
    assert_eq!(parse_color("#ffffffff"), 0xffffffff);
}

#[test]
fn test_hex_8_digits_no_hash() {
    assert_eq!(parse_color("aabbccdd"), 0xaabbccdd);
}

#[test]
fn test_invalid_input() {
    assert_eq!(parse_color(""), 0x000000ff);
    assert_eq!(parse_color("notacolor"), 0x000000ff);
    assert_eq!(parse_color("#xyz"), 0x000000ff);
    assert_eq!(parse_color("#12345"), 0x000000ff);
}
