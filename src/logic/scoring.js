export function liarScoreFor(playerCount) {
  return Math.ceil(playerCount / 2);
}

export function calcRoundScore({ playerCount, liarIndices, votedOutIndices, reversalSuccess }) {
  const liarSet = new Set(liarIndices);
  const anyLiarCaught = votedOutIndices.some(index => liarSet.has(index));
  const liarWon = !anyLiarCaught || reversalSuccess;
  const perPlayerDelta = new Array(playerCount).fill(0);

  if (liarWon) {
    const score = liarScoreFor(playerCount);
    liarIndices.forEach(index => {
      perPlayerDelta[index] = score;
    });
  } else {
    perPlayerDelta.forEach((_, index) => {
      if (!liarSet.has(index)) {
        perPlayerDelta[index] = 1;
      }
    });
  }

  return { perPlayerDelta, liarWon };
}
