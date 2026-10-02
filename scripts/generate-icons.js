import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal PNG generator using uncompressed IDAT with Deflate
function createSolidColorPng(width, height, r, g, b, a = 255) {
  // Raw RGBA buffer with filter byte 0 at start of each scanline
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      
      // Draw Care Saathi emblem: teal background with a centered white cross & heart silhouette
      const cx = width / 2;
      const cy = height / 2;
      const distFromCenter = Math.hypot(x - cx, y - cy);
      const radius = width * 0.45;

      // Rounded emblem background
      if (distFromCenter <= radius) {
        // Medical cross
        const crossThick = width * 0.12;
        const crossLength = width * 0.28;
        const inCrossV = Math.abs(x - cx) <= crossThick && Math.abs(y - cy) <= crossLength;
        const inCrossH = Math.abs(y - cy) <= crossThick && Math.abs(x - cx) <= crossLength;

        if (inCrossV || inCrossH) {
          // White cross
          rawData[pixelOffset] = 255;
          rawData[pixelOffset + 1] = 255;
          rawData[pixelOffset + 2] = 255;
          rawData[pixelOffset + 3] = 255;
        } else {
          // Teal base: #0d9488 (r: 13, g: 148, b: 136)
          rawData[pixelOffset] = 13;
          rawData[pixelOffset + 1] = 148;
          rawData[pixelOffset + 2] = 136;
          rawData[pixelOffset + 3] = 255;
        }
      } else {
        // Transparent border or squircle background
        rawData[pixelOffset] = 13;
        rawData[pixelOffset + 1] = 148;
        rawData[pixelOffset + 2] = 136;
        rawData[pixelOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression method: 0
  ihdr[11] = 0; // Filter method: 0
  ihdr[12] = 0; // Interlace: 0
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32BE(data.length, 0);

  const crcBuffer = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuffer, data]));
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([lengthBuffer, typeBuffer, data, crcBuffer]);
}

// CRC-32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createSolidColorPng(192, 192, 13, 148, 136));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createSolidColorPng(512, 512, 13, 148, 136));
console.log('Care Saathi PWA icons generated successfully: icon-192.png, icon-512.png');
