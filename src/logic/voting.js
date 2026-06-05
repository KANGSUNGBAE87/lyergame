export function totalVotes(votes) {
  return votes.reduce((sum, value) => sum + value, 0);
}

export function getVotedOutIndices(votes) {
  const max = Math.max(...votes);
  return max > 0
    ? votes.map((value, index) => (value === max ? index : -1)).filter(index => index >= 0)
    : [];
}
