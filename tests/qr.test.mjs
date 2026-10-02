import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
test('QR decodes to the same App Store destination as the text link', async () => {
  const image = PNG.sync.read(await readFile('public/app-store-qr.png'));
  const code = jsQR(new Uint8ClampedArray(image.data), image.width, image.height);
  const config = await readFile('src/config.ts', 'utf8');
  assert.equal(code?.data, config.match(/export const APP_STORE_URL =\s*'([^']+)'/)[1]);
});
