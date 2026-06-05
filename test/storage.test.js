import { beforeEach, describe, expect, it } from 'vitest';
import * as storage from '../src/core/storage.js';

beforeEach(() => localStorage.clear());

describe('storage', () => {
  it('returns fallback when a key is missing', () => {
    expect(storage.get('missing', 'fallback')).toBe('fallback');
  });

  it('round-trips string values', () => {
    storage.set('name', 'liar');
    expect(storage.get('name')).toBe('liar');
  });

  it('round-trips JSON values', () => {
    storage.setJSON('settings', { playerCount: 6, difficulty: 2 });
    expect(storage.getJSON('settings', null)).toEqual({ playerCount: 6, difficulty: 2 });
  });

  it('returns fallback for corrupted JSON', () => {
    storage.set('bad-json', '{not json');
    expect(storage.getJSON('bad-json', 42)).toBe(42);
  });
});
