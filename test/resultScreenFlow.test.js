import { describe, expect, it } from 'vitest';
import { shouldSkipResultCountdown } from '../src/screens/ResultScreen.jsx';

describe('result screen flow', () => {
  it('skips the result countdown after a caught liar reversal judgment', () => {
    expect(shouldSkipResultCountdown({
      votedOutIndices: [0, 2],
      liarIndices: [2],
    })).toBe(true);
  });

  it('keeps the result countdown when no liar was caught by the vote', () => {
    expect(shouldSkipResultCountdown({
      votedOutIndices: [0, 1],
      liarIndices: [2],
    })).toBe(false);
  });
});
