import { describe, expect, it } from 'vitest';
import { getNextVoteStep } from '../src/logic/voteFlow.js';

describe('vote flow', () => {
  it('moves directly to the next voter after saving a vote', () => {
    expect(getNextVoteStep({
      currentVoter: 1,
      playerCount: 4,
    })).toEqual({ type: 'next-voter', nextVoter: 2 });
  });

  it('moves to vote counting after the last voter saves', () => {
    expect(getNextVoteStep({
      currentVoter: 3,
      playerCount: 4,
    })).toEqual({ type: 'count-votes' });
  });
});
