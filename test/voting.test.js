import { describe, expect, it } from 'vitest';
import {
  buildVoteCounts,
  getSelectableCandidateIndices,
  getTopVotedIndices,
  getVotedOutIndices,
  isVoteTie,
  totalVotes,
} from '../src/logic/voting.js';

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

describe('buildVoteCounts', () => {
  it('counts pass-phone secret votes by selected target', () => {
    expect(buildVoteCounts([2, 2, 0, null], 4)).toEqual([1, 0, 2, 0]);
  });

  it('ignores invalid or empty votes', () => {
    expect(buildVoteCounts([1, -1, 8, undefined], 4)).toEqual([0, 1, 0, 0]);
  });
});

describe('getTopVotedIndices', () => {
  it('returns tied top candidates and hides zero-vote ties', () => {
    expect(getTopVotedIndices([2, 1, 2, 0])).toEqual([0, 2]);
    expect(getTopVotedIndices([0, 0, 0])).toEqual([]);
  });
});

describe('isVoteTie', () => {
  it('detects only meaningful top-vote ties', () => {
    expect(isVoteTie([2, 1, 2])).toBe(true);
    expect(isVoteTie([0, 0, 0])).toBe(false);
    expect(isVoteTie([3, 1, 2])).toBe(false);
  });
});

describe('getSelectableCandidateIndices', () => {
  it('excludes the current voter from normal voting', () => {
    expect(getSelectableCandidateIndices({ playerCount: 4, voterIndex: 1 })).toEqual([0, 2, 3]);
  });

  it('limits runoff voting to tied candidates while still excluding self', () => {
    expect(getSelectableCandidateIndices({ playerCount: 5, voterIndex: 2, runoffCandidates: [1, 2, 4] })).toEqual([1, 4]);
  });
});
