pub struct PixelBuffer{
    width: u32,
    height: u32,
    data: Vec<u32>
}

impl PixelBuffer{
    pub fn new(width: u32, height: u32) -> Self {
        Self { 
            width,
            height,
            data: vec![0; (width * height) as usize],
        }
    }
}