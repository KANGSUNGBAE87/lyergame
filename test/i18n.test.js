import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, getMessage, interpolate, isSupportedLocale } from '../src/i18n/messages.js';

describe('i18n messages', () => {
  it('uses Korean as the default locale', () => {
    expect(DEFAULT_LOCALE).toBe('ko');
  });

  it('supports Korean and English locales', () => {
    expect(isSupportedLocale('ko')).toBe(true);
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('jp')).toBe(false);
  });

  it('falls back to Korean when an English message is missing', () => {
    expect(getMessage('en', 'app.title')).toBe('Liar Game');
    expect(getMessage('en', 'missing.key')).toBe('missing.key');
  });

  it('interpolates named values in messages', () => {
    expect(interpolate('{count} players · {rounds}R', { count: 6, rounds: 3 })).toBe('6 players · 3R');
  });

  it('labels unrestricted difficulty as mixed, not all', () => {
    expect(getMessage('ko', 'setup.difficulty.0')).toBe('혼합');
    expect(getMessage('en', 'setup.difficulty.0')).toBe('Mixed');
  });

  it('uses game method copy for the guide button', () => {
    expect(getMessage('ko', 'setup.guide.open')).toBe('게임방법');
    expect(getMessage('en', 'setup.guide.open')).toBe('How to play');
  });

  it('labels advanced settings disclosure and category hint clearly', () => {
    expect(getMessage('ko', 'setup.advanced.openLabel')).toBe('펼치기');
    expect(getMessage('ko', 'setup.advanced.closeLabel')).toBe('접기');
    expect(getMessage('ko', 'setup.liarHint.label')).toBe('카테고리 힌트 보기');
    expect(getMessage('en', 'setup.liarHint.label')).toBe('Show category hint');
  });
});
