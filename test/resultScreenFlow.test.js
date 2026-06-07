import { describe, expect, it } from 'vitest';
import {
  shouldShowMissedStatusBelowTitle,
  shouldShowMostSuspiciousHighlight,
  shouldSkipResultCountdown,
} from '../src/screens/ResultScreen.jsx';

describe('result screen flow', () => {
  it('skips the result countdown after a caught liar reversal judgment', () => {
    expect(shouldSkipResultCountdown({
      votedOutIndices: [0, 2],
      liarIndices: [2],
    })).toBe(true);
  });

  it('also skips the result countdown when no liar was caught by the vote', () => {
    expect(shouldSkipResultCountdown({
      votedOutIndices: [0, 1],
      liarIndices: [2],
    })).toBe(true);
  });

  it('hides the most suspicious highlight when the liar was already caught', () => {
    expect(shouldShowMostSuspiciousHighlight({
      voteCaughtLiar: true,
      mostSuspicious: { indices: [3], votes: 4 },
    })).toBe(false);
  });

  it('keeps the most suspicious highlight when the liar escaped', () => {
    expect(shouldShowMostSuspiciousHighlight({
      voteCaughtLiar: false,
      mostSuspicious: { indices: [1], votes: 3 },
    })).toBe(true);
  });

  it('shows the missed status under the title only when the liar was not caught', () => {
    expect(shouldShowMissedStatusBelowTitle({
      lastLiarWon: true,
      voteCaughtLiar: false,
    })).toBe(true);

    expect(shouldShowMissedStatusBelowTitle({
      lastLiarWon: true,
      voteCaughtLiar: true,
    })).toBe(false);
  });
});
