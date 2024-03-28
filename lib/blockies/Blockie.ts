import * as base64 from "https://deno.land/std@0.220.1/encoding/base64.ts";

export class Blockie {
  scale: number;
  seed: string;

  constructor({ scale, seed }: { scale: number; seed: string }) {
    this.scale = scale;
    this.seed = seed;
  }

  base64() {
    // original blockie code used to create indexStream
    // https://github.com/MyCryptoHQ/ethereum-blockies-base64/blob/master/src/main.js

    const randomBuffer = [0, 0, 0, 0];

    for (let i = 0; i < this.seed.length; i++) {
      randomBuffer[i % 4] = (randomBuffer[i % 4] << 5) -
        randomBuffer[i % 4] +
        this.seed.toLowerCase().charCodeAt(i);
    }

    function nextRandomNumber() {
      const t = randomBuffer[0] ^ (randomBuffer[0] << 11);
      randomBuffer[0] = randomBuffer[1];
      randomBuffer[1] = randomBuffer[2];
      randomBuffer[2] = randomBuffer[3];
      randomBuffer[3] = randomBuffer[3] ^ (randomBuffer[3] >> 19) ^ t ^
        (t >> 8);
      return (randomBuffer[3] >>> 0) / (1 << 31 >>> 0);
    }

    function nextRandomRgb() {
      // get hsl values
      const h = Math.floor(nextRandomNumber() * 360) / 360;
      const s = (nextRandomNumber() * 60 + 40) / 100;
      const l = (nextRandomNumber() + nextRandomNumber() + nextRandomNumber() +
        nextRandomNumber()) * 25 / 100;
      // then convert to rgb https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
      let r, g, b;
      if (s === 0) r = g = b = l;
      else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
      }
      return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255),
      ];
    }

    function hueToRgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    function getIndexStream() {
      const data = [];
      for (let y = 0; y < 8; y++) {
        let row = [];
        for (let x = 0; x < 4; x++) {
          row[x] = Math.floor(nextRandomNumber() * 2.3);
        }
        const r = row.slice(0, 4).reverse();
        row = row.concat(r);
        for (let i = 0; i < row.length; i++) {
          data.push(row[i]);
        }
      }
      return data.map(String);
    }

    const colors = {
      primary: nextRandomRgb(),
      background: nextRandomRgb(),
      spot: nextRandomRgb(),
    };

    // demystifying gif internals
    // https://www.w3.org/Graphics/GIF/spec-gif89a.txt
    // https://giflib.sourceforge.net/whatsinagif/index.html

    const headerBlock = new TextEncoder().encode("GIF89a");

    const logicalScreenDescriptor = new Uint8Array([
      (8 * this.scale) & 0xff,
      (8 * this.scale) >> 8, // width, 2 bytes
      (8 * this.scale) & 0xff,
      (8 * this.scale) >> 8, // height, 2 bytes
      //GBBBSZZZ
      0b11110001, // (G)lobal color table, 8 (B)its per primary color, no (S)ort, color table si(Z)e 4 (3 needed for blockies) # 2^(Z+1)
      0, // background color index
      0, // pixel aspect ratio (not used)
    ]);

    const globalColorTable = new Uint8Array([
      ...colors.background, // bg
      ...colors.primary, // primary
      ...colors.spot, // secondary
      0x00,
      0x00,
      0x00, // unused
    ]);

    const imageDescriptor = new Uint8Array([
      0x2c, // required constant
      0x00,
      0x00, // left position
      0x00,
      0x00, // top position
      (8 * this.scale) & 0xff,
      (8 * this.scale) >> 8, // width
      (8 * this.scale) & 0xff,
      (8 * this.scale) >> 8, // height
      //LISRRZZZ
      0b00000000, // (L)ocal color table, (I)nterlace, (S)ort, (R)eserved, si(Z)e of local color table
    ]);

    const lzwMinimumCodeSize = 2;

    const indexStream = getIndexStream();

    // assuming indexStream is a box, get length
    const l = Math.sqrt(indexStream.length);
    const scaledL = l * this.scale;

    const scaledIndexStream: string[] = [];

    // for each index in indexStream
    for (let i = 0; i < indexStream.length; i++) {
      // get x and y, where top left is 0 0
      const x = i % l;
      const y = Math.floor(i / l);
      // get the scaled x and y
      const scaledX = x * this.scale;
      const scaledY = y * this.scale;
      for (let j = 0; j < this.scale; j++) {
        for (let k = 0; k < this.scale; k++) {
          scaledIndexStream[scaledX + k + (scaledY + j) * scaledL] =
            indexStream[i];
        }
      }
    }

    // console.log(scaledIndexStream)

    const codeTable = new Map<string, string>([
      ["0", "0"], // bg
      ["1", "1"], // primary
      ["2", "2"], // secondary
      ["3", "3"], // unused
      ["4", "4"], // clear code
      ["5", "5"], // end of information code
    ]);

    // start codeStream with a clear code
    const codeStream: number[] = [4];
    let currentByte = 0b00000100;
    let cursor = 3;
    const bytes: number[] = [];

    // start indexBuffer with first index
    let indexBuffer: string = scaledIndexStream[0];

    // code size starts at 3
    let codeSize = 3;

    // pack code into bytes (only handles code sizes <= 0xff
    function pack(code: number) {
      currentByte += (code << cursor) & 0xff;
      if (cursor + codeSize >= 16) {
        bytes.push(currentByte);
        currentByte = (code << cursor) >> 8;
        bytes.push(currentByte);
        currentByte = (code << cursor) >> 16;
        cursor = cursor + codeSize - 16;
      } else if (cursor + codeSize >= 8) {
        bytes.push(currentByte);
        currentByte = (code << cursor) >> 8;
        cursor = cursor + codeSize - 8;
      } else cursor += codeSize;
    }

    // iterate through scaledIndexStream
    for (const k of scaledIndexStream.slice(1)) {
      if (codeTable.has(indexBuffer + k)) {
        indexBuffer += k;
      } else {
        if (codeTable.size - 1 == 2 ** codeSize) codeSize++;

        codeTable.set(indexBuffer + k, String(codeTable.size));

        const code = Number(codeTable.get(indexBuffer) as string);
        codeStream.push(code);
        pack(code);

        indexBuffer = k;
      }
    }

    // add remaining indexBuffer
    const code = Number(codeTable.get(indexBuffer) as string);
    codeStream.push(code);
    pack(code);

    // add end of code
    codeStream.push(5);
    pack(5);

    // push final byte
    if (cursor > 0) bytes.push(currentByte);

    const dataSubBlocks = [];

    while (bytes.length) {
      dataSubBlocks.push(
        new Uint8Array([
          Math.min(bytes.length, 255),
          ...bytes.splice(0, 255),
        ]),
      );
    }

    const imageData = new Uint8Array([
      lzwMinimumCodeSize,
      ...dataSubBlocks.flatMap((dataSubBlock) => [...dataSubBlock]),
      0,
    ]);

    const trailer = new Uint8Array([
      0x3b, // required constant
    ]);

    const gifData = new Uint8Array([
      ...headerBlock,
      ...logicalScreenDescriptor,
      ...globalColorTable,
      ...imageDescriptor,
      ...imageData,
      ...trailer,
    ]);

    return `data:image/gif;base64,${base64.encodeBase64(gifData)}`;
  }
}

// const blockie = new Blockie({ scale: 16, seed: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' })

// console.log(blockie.base64())
