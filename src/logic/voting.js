export function totalVotes(votes) {
  return votes.reduce((sum, value) => sum + value, 0);
}

export function getTopVotedIndices(votes) {
  const max = Math.max(0, ...votes);
  return max > 0
    ? votes.map((value, index) => (value === max ? index : -1)).filter(index => index >= 0)
    : [];
}

export function getVotedOutIndices(votes) {
  return getTopVotedIndices(votes);
}

export function buildVoteCounts(votesByVoter, playerCount) {
  const counts = new Array(playerCount).fill(0);
  votesByVoter.forEach(targetIndex => {
    if (Number.isInteger(targetIndex) && targetIndex >= 0 && targetIndex < playerCount) {
      counts[targetIndex] += 1;
    }
  });
  return counts;
}

export function isVoteTie(votes) {
  return getTopVotedIndices(votes).length > 1;
}

export function getSelectableCandidateIndices({ playerCount, voterIndex, runoffCandidates = null }) {
  const candidates = Array.isArray(runoffCandidates)
    ? runoffCandidates
    : Array.from({ length: playerCount }, (_, index) => index);
  return candidates.filter(index => index !== voterIndex);
}
