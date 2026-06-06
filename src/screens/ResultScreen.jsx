import { useEffect, useState } from 'react';
import LiarMascot from '../components/LiarMascot.jsx';
import ResultSplash from '../components/ResultSplash.jsx';
import RoundHighlightRow from '../components/RoundHighlightRow.jsx';
import Scoreboard from '../components/Scoreboard.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { playerNameWithNumber } from '../logic/players.js';
import { useGame } from '../store/gameStore.jsx';

function formatPlayers(indices = [], playerNames = []) {
  return indices.map(index => playerNameWithNumber(index, playerNames)).join(', ');
}

function formatVoteItems(indices = [], voteCounts = [], playerNames = [], t) {
  return indices.map(index => t('result.vote.item', {
    player: playerNameWithNumber(index, playerNames),
    count: voteCounts[index] ?? 0,
  })).join(' · ');
}

export function shouldSkipResultCountdown(state) {
  return (state.votedOutIndices ?? []).some(index => (state.liarIndices ?? []).includes(index));
}

export default function ResultScreen() {
  const { state, dispatch } = useGame();
  const { t, categoryLabel } = useI18n();
  const skipCountdown = shouldSkipResultCountdown(state);
  const [countdown, setCountdown] = useState(skipCountdown ? 0 : 3);
  const isLastRound = state.round >= state.config.totalRounds;
  const lastRound = state.perRound[state.perRound.length - 1];
  const highlights = lastRound?.highlights ?? {};
  const liars = formatPlayers(state.liarIndices, state.config.playerNames);
  const judgmentCandidates = formatPlayers(state.votedOutIndices, state.config.playerNames);
  const voteSummary = formatVoteItems(state.votedOutIndices, state.voteCounts, state.config.playerNames, t);
  const voteCaughtLiar = state.votedOutIndices.some(index => state.liarIndices.includes(index));
  const mostSuspicious = highlights.mostSuspicious;
  const unfairCitizen = highlights.unfairCitizen;
  const showSummary = countdown <= 0;
  const buttonLabel = isLastRound
    ? t('result.final')
    : t('result.nextRound', { round: state.round + 1, total: state.config.totalRounds });

  useEffect(() => {
    if (skipCountdown || showSummary) return undefined;
    const timer = window.setTimeout(() => {
      setCountdown(value => value - 1);
    }, 720);
    return () => window.clearTimeout(timer);
  }, [skipCountdown, showSummary, countdown]);

  if (!showSummary) {
    return (
      <div className="screen result result-countdown">
        <p className="eyebrow">{t('result.round', { round: state.round })}</p>
        <div className="countdown-stage" aria-live="polite">
          <span className="countdown-label">{t('result.countdown.ready')}</span>
          <strong className="countdown-number">{countdown}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="screen result">
      <p className="eyebrow">{t('result.round', { round: state.round })}</p>
      <ResultSplash label={t('result.countdown.revealed')} />
      <h2 className="section-title">{state.lastLiarWon ? t('result.liarWin') : t('result.citizenWin')}</h2>
      <div className="reveal-panel">
        <div className="result-fact-row vote-first">
          <span>{t('result.vote.label')}</span>
          <b>{voteSummary}</b>
        </div>
        <div className={voteCaughtLiar ? 'result-judgment caught' : 'result-judgment missed'}>
          {voteCaughtLiar ? t('result.vote.caught') : t('result.vote.missed')}
        </div>
        <div className="result-fact-row">
          <span>{t('result.vote.candidate')}</span>
          <b>{judgmentCandidates}</b>
        </div>
        <div className="liar-dudung">
          <div className="liar-dudung-art">
            <LiarMascot className="liar-mascot result-mascot" />
          </div>
          <span>{t('result.liarDudung')}</span>
          <b>{liars}</b>
        </div>
        <div className="result-fact-row word-row">
          <span>{t('result.wordLabel')}</span>
          <b>{state.word} · {categoryLabel(state.category)}</b>
        </div>
        {state.runoffOf.length ? (
          <p>{t('result.vote.runoff', { players: formatPlayers(state.runoffOf, state.config.playerNames) })}</p>
        ) : null}
        {state.usedQuickJudgment ? (
          <p>{t('result.vote.quickJudge', { players: formatPlayers(state.votedOutIndices, state.config.playerNames) })}</p>
        ) : null}
      </div>

      <div className="highlight-list">
        {mostSuspicious?.votes > 0 ? (
          <RoundHighlightRow
            type="suspicious"
            label={t('result.highlight.suspicious')}
            value={`${formatPlayers(mostSuspicious.indices, state.config.playerNames)} · ${t('result.highlight.votes', { count: mostSuspicious.votes })}`}
          />
        ) : null}
        {unfairCitizen?.votes > 0 ? (
          <RoundHighlightRow
            type="unfair"
            label={t('result.highlight.unfair')}
            value={formatPlayers(unfairCitizen.indices, state.config.playerNames)}
          />
        ) : null}
        {highlights.hiddenLiars?.length ? (
          <RoundHighlightRow
            type="hidden"
            label={t('result.highlight.hiddenLiar')}
            value={formatPlayers(highlights.hiddenLiars, state.config.playerNames)}
          />
        ) : null}
        {highlights.reversalLiars?.length ? (
          <RoundHighlightRow
            type="reversal"
            label={t('result.highlight.reversal')}
            value={formatPlayers(highlights.reversalLiars, state.config.playerNames)}
          />
        ) : null}
        {highlights.chaos ? (
          <RoundHighlightRow
            type="chaos"
            label={t('result.highlight.chaos')}
            value={formatPlayers(state.votedOutIndices, state.config.playerNames)}
          />
        ) : null}
      </div>
      <Scoreboard scores={state.scores} delta={state.lastDelta} liarIndices={state.liarIndices} playerNames={state.config.playerNames} />
      <button className="primary-btn wide" type="button" onClick={() => dispatch({ type: 'NEXT_ROUND' })}>
        {buttonLabel}
      </button>
    </div>
  );
}
