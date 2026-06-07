export function getNextVoteStep({ currentVoter = 0, playerCount = 0 } = {}) {
  return currentVoter >= playerCount - 1
    ? { type: 'count-votes' }
    : { type: 'next-voter', nextVoter: currentVoter + 1 };
}
