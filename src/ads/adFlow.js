import { adsProvider } from './adsProvider.js';

export async function runAfterInterstitial({
  ads = adsProvider,
  placementId,
  action,
}) {
  try {
    await ads.showInterstitial(placementId);
  } catch {
    // Ads must never block the offline party flow.
  }

  return action?.();
}

export async function preloadInterstitial(ads = adsProvider, placementId) {
  if (typeof ads.preloadInterstitial !== 'function') {
    return { ok: false, reason: 'not-configured', placementId };
  }

  try {
    return await ads.preloadInterstitial(placementId);
  } catch {
    return { ok: false, reason: 'not-configured', placementId };
  }
}
