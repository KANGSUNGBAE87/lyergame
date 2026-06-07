import { PLATFORM_TARGETS } from './platformServices.js';

function getViteEnv() {
  return typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
}

export function getRuntimePlatformTarget(env = getViteEnv()) {
  const target = env.VITE_PLATFORM_TARGET;
  return PLATFORM_TARGETS.includes(target) ? target : 'web';
}

export function readBooleanFlag(env = getViteEnv(), key, defaultValue = true) {
  const value = env[key];
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  return !['0', 'false', 'no', 'off'].includes(String(value).toLowerCase());
}

export function isAuthPromptEnabled(env = getViteEnv()) {
  return readBooleanFlag(env, 'VITE_AUTH_PROMPTS', true);
}

export function isAdSlotEnabled(env = getViteEnv()) {
  return readBooleanFlag(env, 'VITE_AD_SLOTS', true);
}
