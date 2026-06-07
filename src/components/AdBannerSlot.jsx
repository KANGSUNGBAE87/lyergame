import React, { useEffect, useState } from 'react';
import { adsProvider } from '../ads/adsProvider.js';

export function shouldRenderAdBanner(status) {
  return Boolean(status?.ok);
}

export default function AdBannerSlot({
  placementId,
  label,
  status,
  provider = adsProvider,
}) {
  const [resolvedStatus, setResolvedStatus] = useState(status ?? null);

  useEffect(() => {
    if (status) {
      setResolvedStatus(status);
      return undefined;
    }

    let active = true;
    provider.requestBanner(placementId).then(result => {
      if (active) setResolvedStatus(result);
    }).catch(() => {
      if (active) setResolvedStatus({ ok: false, reason: 'not-configured', placementId });
    });

    return () => {
      active = false;
    };
  }, [placementId, provider, status]);

  if (!shouldRenderAdBanner(resolvedStatus)) {
    return null;
  }

  return (
    <aside className="ad-banner-slot" data-ad-placement={placementId} aria-label={label} />
  );
}
