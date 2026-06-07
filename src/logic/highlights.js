function topIndicesFromValues(values) {
  const max = Math.max(0, ...values);
  return max > 0
    ? values.map((value, index) => (value === max ? index : -1)).filter(index => index >= 0)
    : [];
}

function sumVotesByPlayer(perRound = [], playerCount) {
  return perRound.reduce((totals, round) => {
    (round.voteCounts ?? []).forEach((votes, index) => {
      totals[index] = (totals[index] ?? 0) + votes;
    });
    return totals;
  }, new Array(playerCount).fill(0));
}

function includesAny(indices = [], targets = []) {
  const targetSet = new Set(targets);
  return indices.some(index => targetSet.has(index));
}

export function deriveRoundHighlights({
  playerCount,
  liarIndices = [],
  votedOutIndices = [],
  voteCounts = [],
  liarWon = false,
  reversalSuccess = false,
}) {
  const normalizedVoteCounts = Array.from({ length: playerCount }, (_, index) => voteCounts[index] ?? 0);
  const topIndices = topIndicesFromValues(normalizedVoteCounts);
  const topVotes = topIndices.length ? normalizedVoteCounts[topIndices[0]] : 0;
  const liarSet = new Set(liarIndices);
  const caughtLiar = includesAny(votedOutIndices, liarIndices);
  const unfairCitizenIndices = topIndices.filter(index => !liarSet.has(index));

  return {
    mostSuspicious: topIndices.length ? { indices: topIndices, votes: topVotes } : null,
    unfairCitizen: unfairCitizenIndices.length ? { indices: unfairCitizenIndices, votes: topVotes } : null,
    hiddenLiars: liarWon && !caughtLiar
      ? liarIndices.filter(index => normalizedVoteCounts[index] === 0)
      : [],
    reversalLiars: liarWon && reversalSuccess ? liarIndices.filter(index => votedOutIndices.includes(index)) : [],
    chaos: votedOutIndices.length > 1,
  };
}

export function deriveFinalRecap({ scores = [], perRound = [] }) {
  const playerCount = scores.length;
  const maxScore = Math.max(0, ...scores);
  const winners = maxScore > 0
    ? scores.map((score, index) => (score === maxScore ? index : -1)).filter(index => index >= 0)
    : [];
  const voteTotals = sumVotesByPlayer(perRound, playerCount);
  const suspicionIndices = topIndicesFromValues(voteTotals);
  const suspicionVotes = suspicionIndices.length ? voteTotals[suspicionIndices[0]] : 0;
  const unfairTotals = new Array(playerCount).fill(0);
  const liarWinTotals = new Array(playerCount).fill(0);
  const reversalTotals = new Array(playerCount).fill(0);

  perRound.forEach(round => {
    const liarSet = new Set(round.liarIndices ?? []);
    (round.voteCounts ?? []).forEach((votes, index) => {
      if (!liarSet.has(index)) {
        unfairTotals[index] += votes;
      }
    });

    if (round.liarWon) {
      (round.liarIndices ?? []).forEach(index => {
        liarWinTotals[index] += 1;
      });
    }

    if (round.liarWon && round.reversalSuccess) {
      (round.liarIndices ?? []).forEach(index => {
        if ((round.votedOutIndices ?? []).includes(index)) {
          reversalTotals[index] += 1;
        }
      });
    }
  });

  const unfairIndices = topIndicesFromValues(unfairTotals);
  const bestLiarIndices = topIndicesFromValues(liarWinTotals);
  const reversalHeroIndices = topIndicesFromValues(reversalTotals);

  return {
    winners: { indices: winners, score: maxScore },
    suspicionKing: suspicionIndices.length ? { indices: suspicionIndices, votes: suspicionVotes } : { indices: [], votes: 0 },
    unfairCitizen: unfairIndices.length ? { indices: unfairIndices, votes: unfairTotals[unfairIndices[0]] } : { indices: [], votes: 0 },
    bestLiar: bestLiarIndices.length ? { indices: bestLiarIndices, wins: liarWinTotals[bestLiarIndices[0]] } : { indices: [], wins: 0 },
    reversalHero: reversalHeroIndices.length ? { indices: reversalHeroIndices, count: reversalTotals[reversalHeroIndices[0]] } : { indices: [], count: 0 },
  };
}
