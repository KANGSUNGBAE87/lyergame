import React, { createContext, useContext, useReducer } from 'react';
import { assignRoles } from '../logic/assignRoles.js';
import { pickWord } from '../logic/pickWord.js';
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
    reversalSuccess: false,
    lastDelta: [],
    lastLiarWon: false,
  };
}

function roundRecord(state, perPlayerDelta, liarWon) {
  return {
    round: state.round,
    liarIndices: state.liarIndices,
    category: state.category,
    word: state.word,
    words: state.words,
    votedOutIndices: state.votedOutIndices,
    reversalSuccess: state.reversalSuccess,
    deltas: perPlayerDelta,
    liarWon,
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
      const config = action.config;
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
      const next = { ...state, votedOutIndices: action.votedOutIndices };
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
