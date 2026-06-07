import { describe, expect, it } from 'vitest';
import { deriveFinalRecap, deriveRoundHighlights } from '../src/logic/highlights.js';

describe('deriveRoundHighlights', () => {
  it('finds suspicion and unfair citizen highlights from vote counts', () => {
    const highlights = deriveRoundHighlights({
      playerCount: 4,
      liarIndices: [2],
      votedOutIndices: [0],
      voteCounts: [3, 1, 0, 0],
      liarWon: true,
      reversalSuccess: false,
    });

    expect(highlights.mostSuspicious).toEqual({ indices: [0], votes: 3 });
    expect(highlights.unfairCitizen).toEqual({ indices: [0], votes: 3 });
    expect(highlights.hiddenLiars).toEqual([2]);
    expect(highlights.chaos).toBe(false);
  });

  it('marks chaos only when multiple candidates are jointly nominated', () => {
    const highlights = deriveRoundHighlights({
      playerCount: 4,
      liarIndices: [3],
      votedOutIndices: [0, 1],
      voteCounts: [2, 2, 1, 0],
      liarWon: true,
      reversalSuccess: false,
    });

    expect(highlights.chaos).toBe(true);
  });

  it('finds reversal liar highlights after a successful guess', () => {
    const highlights = deriveRoundHighlights({
      playerCount: 5,
      liarIndices: [4],
      votedOutIndices: [4],
      voteCounts: [0, 0, 1, 0, 4],
      liarWon: true,
      reversalSuccess: true,
    });

    expect(highlights.reversalLiars).toEqual([4]);
    expect(highlights.hiddenLiars).toEqual([]);
    expect(highlights.chaos).toBe(false);
  });
});

describe('deriveFinalRecap', () => {
  it('builds winner, suspicion, unfair citizen, best liar, and reversal recaps', () => {
    const recap = deriveFinalRecap({
      scores: [1, 3, 0, 2],
      perRound: [
        {
          liarIndices: [2],
          voteCounts: [3, 0, 0, 0],
          votedOutIndices: [0],
          liarWon: true,
          reversalSuccess: false,
        },
        {
          liarIndices: [3],
          voteCounts: [0, 0, 0, 3],
          votedOutIndices: [3],
          liarWon: true,
          reversalSuccess: true,
        },
      ],
    });

    expect(recap.winners.indices).toEqual([1]);
    expect(recap.suspicionKing).toEqual({ indices: [0, 3], votes: 3 });
    expect(recap.unfairCitizen).toEqual({ indices: [0], votes: 3 });
    expect(recap.bestLiar).toEqual({ indices: [2, 3], wins: 1 });
    expect(recap.reversalHero).toEqual({ indices: [3], count: 1 });
  });

  it('returns empty recap objects when no liar or reversal highlights exist', () => {
    const recap = deriveFinalRecap({
      scores: [1, 0, 0],
      perRound: [
        {
          liarIndices: [2],
          voteCounts: [0, 2, 1],
          votedOutIndices: [1],
          liarWon: false,
          reversalSuccess: false,
        },
      ],
    });

    expect(recap.bestLiar).toEqual({ indices: [], wins: 0 });
    expect(recap.reversalHero).toEqual({ indices: [], count: 0 });
  });
});
