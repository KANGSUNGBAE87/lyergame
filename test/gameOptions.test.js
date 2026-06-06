import { describe, expect, it } from 'vitest';
import { ROUND_OPTIONS } from '../src/config/gameOptions.js';

describe('ROUND_OPTIONS', () => {
  it('supports quick, standard, and long games', () => {
    expect(ROUND_OPTIONS).toEqual([1, 3, 5]);
  });
});
