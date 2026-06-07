import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AdBannerSlot, { shouldRenderAdBanner } from '../src/components/AdBannerSlot.jsx';
import { AD_PLACEMENTS } from '../src/ads/adPlacements.js';

describe('AdBannerSlot', () => {
  it('does not render a fake ad when the adapter is not configured', () => {
    expect(shouldRenderAdBanner({ ok: false, reason: 'not-configured' })).toBe(false);
    expect(renderToStaticMarkup(React.createElement(AdBannerSlot, {
      placementId: AD_PLACEMENTS.HISTORY_BANNER,
      label: '기록 화면 광고',
      status: { ok: false, reason: 'not-configured' },
    }))).toBe('');
  });

  it('renders a stable banner mount point when the adapter enables the placement', () => {
    const html = renderToStaticMarkup(React.createElement(AdBannerSlot, {
      placementId: AD_PLACEMENTS.HISTORY_BANNER,
      label: '기록 화면 광고',
      status: { ok: true },
    }));

    expect(html).toContain('ad-banner-slot');
    expect(html).toContain(`data-ad-placement="${AD_PLACEMENTS.HISTORY_BANNER}"`);
    expect(html).toContain('aria-label="기록 화면 광고"');
  });
});
