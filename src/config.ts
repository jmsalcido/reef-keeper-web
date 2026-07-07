/** The live App Store listing for Reef Keeper: Aquarium Tracker. */
export const APP_STORE_URL =
  'https://apps.apple.com/us/app/reefkeeper-aquarium-tracker/id6780324072';

/** Canonical production origin used for SEO metadata and JSON-LD IDs. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://reefkeeper.otfusion.org').replace(
  /\/$/,
  '',
);

export const APP_NAME = 'Reef Keeper: Aquarium Tracker';
export const BRAND_NAME = 'Reef Keeper';
export const APP_DESCRIPTION =
  'Reef Keeper is the iOS aquarium tracker that logs water parameters in seconds, charts every trend, and reminds you of maintenance.';

export const canonicalUrl = (path = '/') =>
  new URL(path.startsWith('/') ? path : `/${path}`, SITE_URL).toString();

export const canonicalAssetUrl = (path: string) => canonicalUrl(path);

/** Optional support intake endpoint. Configure with VITE_SUPPORT_POST_URL. */
export const SUPPORT_POST_URL = import.meta.env.VITE_SUPPORT_POST_URL ?? '';
