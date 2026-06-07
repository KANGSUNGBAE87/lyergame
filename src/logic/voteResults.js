import { playerNameWithNumber } from './players.js';

export function createVoteResultRows({ voteCounts = [], playerNames = [], candidateIndices = [] } = {}) {
  const candidateSet = new Set(candidateIndices);
  const maxVotes = Math.max(0, ...voteCounts);

  return voteCounts
    .map((count = 0, index) => ({
      index,
      player: playerNameWithNumber(index, playerNames),
      count,
      percent: maxVotes > 0 ? Math.round((count / maxVotes) * 100) : 0,
      isCandidate: candidateSet.has(index),
    }))
    .sort((a, b) => (b.count - a.count) || (a.index - b.index));
}
