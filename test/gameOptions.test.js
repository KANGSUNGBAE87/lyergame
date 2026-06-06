import { describe, expect, it } from 'vitest';
import { MAX_PLAYERS, ROUND_OPTIONS } from '../src/config/gameOptions.js';

describe('ROUND_OPTIONS', () => {
  it('supports quick, standard, and long games', () => {
    expect(ROUND_OPTIONS).toEqual([1, 3, 5]);
  });
});

describe('player count bounds', () => {
  it('allows up to 12 players', () => {
    expect(MAX_PLAYERS).toBe(12);
  });
});
