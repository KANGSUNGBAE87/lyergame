import { describe, expect, it } from 'vitest';
import { calcRoundScore, liarScoreFor } from '../src/logic/scoring.js';

describe('liarScoreFor', () => {
  it('uses ceil(playerCount / 2)', () => {
    expect(liarScoreFor(3)).toBe(2);
    expect(liarScoreFor(4)).toBe(2);
    expect(liarScoreFor(6)).toBe(3);
    expect(liarScoreFor(10)).toBe(5);
  });
});

describe('calcRoundScore', () => {
  it('gives citizens one point when a liar is caught and reversal fails', () => {
    const result = calcRoundScore({
      playerCount: 5,
      liarIndices: [2],
      votedOutIndices: [2],
      reversalSuccess: false,
    });
    expect(result.liarWon).toBe(false);
    expect(result.perPlayerDelta).toEqual([1, 1, 0, 1, 1]);
  });

  it('gives the liar ceil(playerCount / 2) when a citizen is voted out', () => {
    const result = calcRoundScore({
      playerCount: 5,
      liarIndices: [2],
      votedOutIndices: [0],
      reversalSuccess: false,
    });
    expect(result.liarWon).toBe(true);
    expect(result.perPlayerDelta).toEqual([0, 0, 3, 0, 0]);
  });

  it('gives the liar reversal points after a successful word guess', () => {
    const result = calcRoundScore({
      playerCount: 6,
      liarIndices: [4],
      votedOutIndices: [4],
      reversalSuccess: true,
    });
    expect(result.liarWon).toBe(true);
    expect(result.perPlayerDelta[4]).toBe(3);
    expect(result.perPlayerDelta.filter((_, index) => index !== 4).every(value => value === 0)).toBe(true);
  });

  it('gives each liar points when two liars stay hidden', () => {
    const result = calcRoundScore({
      playerCount: 8,
      liarIndices: [1, 5],
      votedOutIndices: [0],
      reversalSuccess: false,
    });
    expect(result.perPlayerDelta[1]).toBe(4);
    expect(result.perPlayerDelta[5]).toBe(4);
  });
});
