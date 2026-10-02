import QRCode from 'qrcode';
import { readFile } from 'node:fs/promises';
const config = await readFile('src/config.ts', 'utf8');
const url = config.match(/export const APP_STORE_URL =\s*'([^']+)'/)[1];
await QRCode.toFile('public/app-store-qr.png', url, { width: 280, margin: 4, errorCorrectionLevel: 'M', color: { dark: '#102f40', light: '#ffffff' } });
