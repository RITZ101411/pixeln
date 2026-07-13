#!/usr/bin/env node
// Converts font data from font.ts to binary format.
//
// Format:
//   [header]
//   width: u8
//   height: u8
//   baseline: u8
//   spacing: u8
//   space_width: u8
//   glyph_count: u16 (LE)
//
//   [glyphs] × glyph_count
//   codepoint: u32 (LE)
//   rows: [u8; height]

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fonts = [
  {
    name: "3x5",
    width: 3,
    height: 5,
    baseline: 4,
    spacing: 1,
    spaceWidth: 2,
  },
  {
    name: "5x7",
    width: 5,
    height: 7,
    baseline: 5,
    spacing: 1,
    spaceWidth: 5,
  },
  {
    name: "8x8",
    width: 8,
    height: 8,
    baseline: 6,
    spacing: 1,
    spaceWidth: 4,
  },
];

const fontTs = fs.readFileSync(path.join(__dirname, "../packages/core/src/font.ts"), "utf-8");

function extractGlyphs(fontName) {
  const regex = new RegExp(`registerFont\\("${fontName}".*?glyphs\\s*}`, "s");
  const match = fontTs.match(regex);
  if (!match) throw new Error(`Font ${fontName} not found`);

  const glyphs = {};
  const glyphRegex = /(?:"([^"\\]|\\.)"|([A-Za-z_]))\s*:\s*\[([^\]]+)\]/g;
  let m;
  while ((m = glyphRegex.exec(match[0])) !== null) {
    let char = m[1] !== undefined ? m[1] : m[2];
    if (char === "\\\\") char = "\\";
    else if (char === '\\"') char = '"';
    const values = m[3].split(",").map((v) => parseInt(v.trim(), 16));
    glyphs[char] = values;
  }
  return glyphs;
}

for (const font of fonts) {
  const glyphs = extractGlyphs(font.name);
  const glyphEntries = Object.entries(glyphs);
  const glyphCount = glyphEntries.length;

  const headerSize = 7;
  const glyphSize = 4 + font.height;
  const bufSize = headerSize + glyphCount * glyphSize;
  const buf = Buffer.alloc(bufSize);

  let offset = 0;
  buf.writeUInt8(font.width, offset++);
  buf.writeUInt8(font.height, offset++);
  buf.writeUInt8(font.baseline, offset++);
  buf.writeUInt8(font.spacing, offset++);
  buf.writeUInt8(font.spaceWidth, offset++);
  buf.writeUInt16LE(glyphCount, offset);
  offset += 2;

  for (const [char, rows] of glyphEntries) {
    const codepoint = char.codePointAt(0);
    buf.writeUInt32LE(codepoint, offset);
    offset += 4;
    for (let i = 0; i < font.height; i++) {
      buf.writeUInt8(rows[i] || 0, offset++);
    }
  }

  const outPath = path.join(__dirname, `../packages/core/fonts/${font.name}.bin`);
  fs.writeFileSync(outPath, buf);
  console.log(`${font.name}: ${glyphCount} glyphs -> ${outPath}`);
}
