import { describe, expect, it } from 'vitest';
import { createVoteResultRows } from '../src/logic/voteResults.js';

describe('createVoteResultRows', () => {
  it('sorts vote results by count and marks judgment candidates', () => {
    expect(createVoteResultRows({
      voteCounts: [1, 3, 0, 3],
      playerNames: ['민수', '', '지연', '도윤'],
      candidateIndices: [1, 3],
    })).toEqual([
      { index: 1, player: '2번', count: 3, percent: 100, isCandidate: true },
      { index: 3, player: '도윤(4번)', count: 3, percent: 100, isCandidate: true },
      { index: 0, player: '민수(1번)', count: 1, percent: 33, isCandidate: false },
      { index: 2, player: '지연(3번)', count: 0, percent: 0, isCandidate: false },
    ]);
  });

  it('keeps zero-vote rows visible without dividing by zero', () => {
    expect(createVoteResultRows({
      voteCounts: [0, 0, 0],
      candidateIndices: [],
    }).map(row => row.percent)).toEqual([0, 0, 0]);
  });
});
