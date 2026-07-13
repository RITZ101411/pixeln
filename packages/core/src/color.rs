use wasm_bindgen::prelude::*;

const NAMED_COLORS: &[(&str, u32)] = &[
    ("black", 0x000000ff),
    ("white", 0xffffffff),
    ("red", 0xff0000ff),
    ("green", 0x00ff00ff),
    ("blue", 0x0000ffff),
    ("yellow", 0xffff00ff),
    ("cyan", 0x00ffffff),
    ("magenta", 0xff00ffff),
    ("transparent", 0x00000000),
];

#[wasm_bindgen(js_name = "parseColor")]
pub fn parse_color(input: &str) -> u32 {
    let lower = input.to_ascii_lowercase();

    for &(name, value) in NAMED_COLORS {
        if lower == name {
            return value;
        }
    }

    let hex = lower.strip_prefix('#').unwrap_or(&lower);
    match hex.len() {
        6 => {
            if let Ok(rgb) = u32::from_str_radix(hex, 16) {
                (rgb << 8) | 0xff
            } else {
                0x000000ff
            }
        }
        8 => u32::from_str_radix(hex, 16).unwrap_or(0x000000ff),
        _ => 0x000000ff,
    }
}

pub fn parse_color_value(input: ColorInput) -> u32 {
    match input {
        ColorInput::Numeric(n) => n,
        ColorInput::Str(s) => parse_color(s),
    }
}

pub enum ColorInput<'a> {
    Numeric(u32),
    Str(&'a str),
}
