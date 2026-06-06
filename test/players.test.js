import { describe, expect, it } from 'vitest';
import { buildPlayerNames, playerLabel, playerNameWithNumber, setPlayerName } from '../src/logic/players.js';

describe('player labels', () => {
  it('uses names when provided and number fallback when blank', () => {
    const names = ['민수', ' ', '지연'];

    expect(playerLabel(0, names)).toBe('민수');
    expect(playerLabel(1, names)).toBe('2번');
    expect(playerLabel(2, names)).toBe('지연');
  });

  it('can include the original number when a name exists', () => {
    const names = ['민수'];

    expect(playerNameWithNumber(0, names)).toBe('민수(1번)');
    expect(playerNameWithNumber(1, names)).toBe('2번');
  });
});

describe('buildPlayerNames', () => {
  it('preserves hidden names up to the max player count', () => {
    expect(buildPlayerNames(['A', 'B'], 4)).toEqual(['A', 'B', '', '']);
    expect(buildPlayerNames(['A', 'B', 'C', 'D'], 2)).toEqual(['A', 'B', 'C', 'D']);
  });
});

describe('setPlayerName', () => {
  it('updates one player and trims excessive whitespace', () => {
    expect(setPlayerName(['A', 'B'], 1, '  지연  ')).toEqual(['A', '지연']);
  });
});
