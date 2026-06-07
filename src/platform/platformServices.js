export const PLATFORM_TARGETS = ['web', 'apps-in-toss', 'google-play'];

const TARGET_DETAILS = {
  web: {
    auth: 'web-auth-stub',
    payments: 'web-payment-stub',
    ads: 'web-ads-stub',
  },
  'apps-in-toss': {
    auth: 'apps-in-toss-auth',
    payments: 'apps-in-toss-iap',
    ads: 'apps-in-toss-ads',
  },
  'google-play': {
    auth: 'google-play-auth',
    payments: 'google-play-billing',
    ads: 'admob',
  },
};

function normalizeTarget(target) {
  return PLATFORM_TARGETS.includes(target) ? target : 'web';
}

function notConfigured(target, feature) {
  return { ok: false, reason: 'not-configured', target, feature };
}

function createAuthService(target) {
  const kind = TARGET_DETAILS[target].auth;
  return {
    kind,
    async getUser() {
      return null;
    },
    async login() {
      return notConfigured(target, 'auth');
    },
    async logout() {
      return notConfigured(target, 'auth');
    },
  };
}

function createPaymentService(target) {
  const kind = TARGET_DETAILS[target].payments;
  return {
    kind,
    async listProducts() {
      return [];
    },
    async purchase(productId) {
      return { ...notConfigured(target, 'payments'), productId };
    },
    async restorePurchases() {
      return notConfigured(target, 'payments');
    },
    async getEntitlements() {
      return [];
    },
  };
}

function createAdsService(target) {
  const kind = TARGET_DETAILS[target].ads;
  return {
    kind,
    async preloadInterstitial(placementId) {
      return { ...notConfigured(target, 'ads'), placementId };
    },
    async showRewarded(placementId) {
      return { ...notConfigured(target, 'ads'), placementId };
    },
    async showInterstitial(placementId) {
      return { ...notConfigured(target, 'ads'), placementId };
    },
    async requestBanner(placementId) {
      return { ...notConfigured(target, 'ads'), placementId };
    },
  };
}

export function createPlatformServices(target = 'web') {
  const normalized = normalizeTarget(target);
  return {
    target: normalized,
    auth: createAuthService(normalized),
    payments: createPaymentService(normalized),
    ads: createAdsService(normalized),
  };
}
