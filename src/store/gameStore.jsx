import React, { createContext, useContext, useReducer } from 'react';
import { assignRoles } from '../logic/assignRoles.js';
import { deriveRoundHighlights } from '../logic/highlights.js';
import { pickWord } from '../logic/pickWord.js';
import { buildPlayerNames } from '../logic/players.js';
import { calcRoundScore } from '../logic/scoring.js';
import { recordsRepository } from '../records/recordsRepository.js';

export const PHASES = ['setup', 'peek', 'discuss', 'vote', 'reversal', 'result', 'final', 'history'];

const defaultConfig = {
  playerCount: 6,
  liarCount: 1,
  categories: [],
  difficulty: 0,
  liarHint: true,
  totalRounds: 3,
  timerMin: 0,
  playerNames: buildPlayerNames([], 6),
};

const initialState = {
  phase: 'setup',
  prevFrom: 'setup',
  config: defaultConfig,
  round: 0,
  scores: [],
  liarIndices: [],
  category: '',
  word: '',
  words: null,
  revealed: [],
  votedOutIndices: [],
  voteCounts: [],
  votesByVoter: [],
  runoffOf: [],
  runoffVoteCounts: [],
  runoffVotesByVoter: [],
  usedQuickJudgment: false,
  reversalSuccess: false,
  lastDelta: [],
  lastLiarWon: false,
  perRound: [],
};

function startRound(config) {
  const liarIndices = assignRoles(config.playerCount, config.liarCount);
  const { category, word, words } = pickWord({
    categories: config.categories,
    difficulty: config.difficulty,
    locale: config.locale,
  });

  return {
    liarIndices,
    category,
    word,
    words,
    revealed: new Array(config.playerCount).fill(false),
    votedOutIndices: [],
    voteCounts: [],
    votesByVoter: [],
    runoffOf: [],
    runoffVoteCounts: [],
    runoffVotesByVoter: [],
    usedQuickJudgment: false,
    reversalSuccess: false,
    lastDelta: [],
    lastLiarWon: false,
  };
}

function roundRecord(state, perPlayerDelta, liarWon) {
  const highlights = deriveRoundHighlights({
    playerCount: state.config.playerCount,
    liarIndices: state.liarIndices,
    votedOutIndices: state.votedOutIndices,
    voteCounts: state.voteCounts,
    liarWon,
    reversalSuccess: state.reversalSuccess,
  });

  return {
    round: state.round,
    liarIndices: state.liarIndices,
    category: state.category,
    word: state.word,
    words: state.words,
    playerNames: state.config.playerNames,
    votedOutIndices: state.votedOutIndices,
    voteCounts: state.voteCounts,
    votesByVoter: state.votesByVoter,
    runoffOf: state.runoffOf,
    runoffVoteCounts: state.runoffVoteCounts,
    runoffVotesByVoter: state.runoffVotesByVoter,
    usedQuickJudgment: state.usedQuickJudgment,
    reversalSuccess: state.reversalSuccess,
    deltas: perPlayerDelta,
    liarWon,
    highlights,
  };
}

function applyScore(state) {
  const { perPlayerDelta, liarWon } = calcRoundScore({
    playerCount: state.config.playerCount,
    liarIndices: state.liarIndices,
    votedOutIndices: state.votedOutIndices,
    reversalSuccess: state.reversalSuccess,
  });
  const scores = state.scores.map((score, index) => score + perPlayerDelta[index]);

  return {
    scores,
    lastDelta: perPlayerDelta,
    lastLiarWon: liarWon,
    perRound: [...state.perRound, roundRecord(state, perPlayerDelta, liarWon)],
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'START': {
      const config = {
        ...action.config,
        playerNames: buildPlayerNames(action.config.playerNames, action.config.playerCount),
      };
      return {
        ...initialState,
        config,
        phase: 'peek',
        round: 1,
        scores: new Array(config.playerCount).fill(0),
        perRound: [],
        ...startRound(config),
      };
    }
    case 'REVEAL': {
      const revealed = state.revealed.slice();
      revealed[action.idx] = true;
      return {
        ...state,
        revealed,
        phase: revealed.every(Boolean) ? 'discuss' : 'peek',
      };
    }
    case 'GO_VOTE':
      return { ...state, phase: 'vote' };
    case 'SET_VOTE': {
      const next = {
        ...state,
        votedOutIndices: action.votedOutIndices,
        voteCounts: action.voteCounts ?? [],
        votesByVoter: action.votesByVoter ?? [],
        runoffOf: action.runoffOf ?? [],
        runoffVoteCounts: action.runoffVoteCounts ?? [],
        runoffVotesByVoter: action.runoffVotesByVoter ?? [],
        usedQuickJudgment: Boolean(action.usedQuickJudgment),
      };
      const caught = next.votedOutIndices.some(index => next.liarIndices.includes(index));
      if (caught) {
        return { ...next, phase: 'reversal' };
      }
      return { ...next, phase: 'result', ...applyScore(next) };
    }
    case 'SET_REVERSAL': {
      const next = { ...state, reversalSuccess: action.success };
      return { ...next, phase: 'result', ...applyScore(next) };
    }
    case 'NEXT_ROUND':
      if (state.round >= state.config.totalRounds) {
        return { ...state, phase: 'final' };
      }
      return {
        ...state,
        phase: 'peek',
        round: state.round + 1,
        ...startRound(state.config),
      };
    case 'GO':
      return { ...state, prevFrom: state.phase, phase: action.phase };
    case 'RESET':
      return initialState;
    case 'RESTART_SAME': {
      const config = {
        ...state.config,
        playerNames: buildPlayerNames(state.config.playerNames, state.config.playerCount),
      };
      return {
        ...initialState,
        config,
        phase: 'peek',
        round: 1,
        scores: new Array(config.playerCount).fill(0),
        perRound: [],
        ...startRound(config),
      };
    }
    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used inside GameProvider');
  }
  return context;
}

export function buildGameRecord(state) {
  const maxScore = Math.max(...state.scores);
  return {
    date: Date.now(),
    playerCount: state.config.playerCount,
    playerNames: state.config.playerNames,
    rounds: state.config.totalRounds,
    categories: state.config.categories.length ? state.config.categories : ['전체'],
    difficulty: state.config.difficulty,
    scores: state.scores,
    winnerIndices: state.scores.map((score, index) => (score === maxScore ? index : -1)).filter(index => index >= 0),
    perRound: state.perRound,
  };
}

export async function saveGameRecord(state) {
  await recordsRepository.saveGame(buildGameRecord(state));
}
