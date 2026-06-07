import { describe, expect, it } from 'vitest';
import {
  getRuntimePlatformTarget,
  isAdSlotEnabled,
  isAuthPromptEnabled,
  readBooleanFlag,
} from '../src/platform/runtimeConfig.js';

describe('runtimeConfig', () => {
  it('defaults to the web target for unknown or missing platform values', () => {
    expect(getRuntimePlatformTarget({})).toBe('web');
    expect(getRuntimePlatformTarget({ VITE_PLATFORM_TARGET: 'unknown-store' })).toBe('web');
  });

  it('accepts the google-play platform target for store packaging', () => {
    expect(getRuntimePlatformTarget({ VITE_PLATFORM_TARGET: 'google-play' })).toBe('google-play');
  });

  it('keeps feature prompts enabled by default and disables explicit false flags', () => {
    expect(readBooleanFlag({}, 'VITE_AUTH_PROMPTS', true)).toBe(true);
    expect(readBooleanFlag({ VITE_AUTH_PROMPTS: 'false' }, 'VITE_AUTH_PROMPTS', true)).toBe(false);
    expect(isAuthPromptEnabled({ VITE_AUTH_PROMPTS: 'false' })).toBe(false);
    expect(isAdSlotEnabled({ VITE_AD_SLOTS: 'false' })).toBe(false);
  });
});
