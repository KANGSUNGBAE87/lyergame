import { describe, expect, it } from 'vitest';
import { getVotedOutIndices, totalVotes } from '../src/logic/voting.js';

describe('totalVotes', () => {
  it('sums all entered votes', () => {
    expect(totalVotes([2, 0, 3, 1])).toBe(6);
  });
});

describe('getVotedOutIndices', () => {
  it('returns an empty list when no votes were entered', () => {
    expect(getVotedOutIndices([0, 0, 0])).toEqual([]);
  });

  it('returns the single highest voted player', () => {
    expect(getVotedOutIndices([1, 3, 2, 0])).toEqual([1]);
  });

  it('returns all tied highest voted players', () => {
    expect(getVotedOutIndices([2, 1, 2, 0])).toEqual([0, 2]);
  });
});
