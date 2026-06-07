import { describe, expect, it, vi } from 'vitest';
import { AD_PLACEMENTS } from '../src/ads/adPlacements.js';
import { runAfterInterstitial } from '../src/ads/adFlow.js';

describe('ad flow helpers', () => {
  it('declares stable platform-neutral ad placements', () => {
    expect(AD_PLACEMENTS).toEqual({
      POST_GAME_INTERSTITIAL: 'post_game_interstitial',
      HISTORY_BANNER: 'history_banner',
      FINAL_RECAP_REWARDED: 'final_recap_rewarded',
    });
  });

  it('runs the post-game action after asking the adapter to show an interstitial', async () => {
    const showInterstitial = vi.fn().mockResolvedValue({ ok: false, reason: 'not-configured' });
    const action = vi.fn(() => 'next-round');

    const result = await runAfterInterstitial({
      ads: { showInterstitial },
      placementId: AD_PLACEMENTS.POST_GAME_INTERSTITIAL,
      action,
    });

    expect(showInterstitial).toHaveBeenCalledWith(AD_PLACEMENTS.POST_GAME_INTERSTITIAL);
    expect(action).toHaveBeenCalledTimes(1);
    expect(result).toBe('next-round');
  });

  it('still runs the action when the ad adapter rejects', async () => {
    const showInterstitial = vi.fn().mockRejectedValue(new Error('network'));
    const action = vi.fn(() => 'restart');

    await expect(runAfterInterstitial({
      ads: { showInterstitial },
      placementId: AD_PLACEMENTS.POST_GAME_INTERSTITIAL,
      action,
    })).resolves.toBe('restart');
  });
});
