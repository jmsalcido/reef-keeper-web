import { APP_STORE_URL } from '../config';
export function IPhoneHandoff() {
  return <details className="iphone-handoff"><summary>Reading on a computer? Open on your iPhone</summary>
    <div><img src="/app-store-qr.png" width="180" height="180" alt="QR code opening Reef Keeper on the App Store" />
      <p>Scan with your iPhone camera to open the App Store listing. Download the app there, then create your aquarium.</p>
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">Open the App Store link instead →</a>
    </div>
  </details>;
}
