import { useState } from 'react';
import Scoreboard from '../components/Scoreboard.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { playerNameWithNumber } from '../logic/players.js';
import { useGame } from '../store/gameStore.jsx';

function formatPlayers(indices = [], playerNames = []) {
  return indices.map(index => playerNameWithNumber(index, playerNames)).join(', ');
}

export default function ResultScreen() {
  const { state, dispatch } = useGame();
  const { t, categoryLabel } = useI18n();
  const [step, setStep] = useState(0);
  const isLastRound = state.round >= state.config.totalRounds;
  const lastRound = state.perRound[state.perRound.length - 1];
  const highlights = lastRound?.highlights ?? {};
  const liars = formatPlayers(state.liarIndices, state.config.playerNames);
  const mostSuspicious = highlights.mostSuspicious;
  const unfairCitizen = highlights.unfairCitizen;
  const showSummary = step >= 3;
  const advance = () => {
    if (!showSummary) {
      setStep(value => value + 1);
      return;
    }
    dispatch({ type: 'NEXT_ROUND' });
  };
  const buttonLabel = showSummary
    ? (isLastRound ? t('result.final') : t('result.nextRound', { round: state.round + 1, total: state.config.totalRounds }))
    : t('result.reveal.next');

  return (
    <div className="screen result">
      <p className="eyebrow">{t('result.round', { round: state.round })}</p>
      <h2 className="section-title">
        {showSummary
          ? (state.lastLiarWon ? t('result.liarWin') : t('result.citizenWin'))
          : (step === 0 ? t('result.reveal.teaser') : t('result.reveal.title'))}
      </h2>
      <div className="reveal-panel">
        {step === 0 ? <p>{t('result.reveal.teaserHelp')}</p> : null}
        {step >= 1 ? (
          <p>{t('result.liarLabel')} <b>{liars}</b></p>
        ) : null}
        {step >= 2 ? (
          <p>{t('result.wordLabel')} <b>{state.word}</b> · {categoryLabel(state.category)}</p>
        ) : null}
        {showSummary ? (
          <>
            {state.runoffOf.length ? (
              <p>{t('result.vote.runoff', { players: formatPlayers(state.runoffOf, state.config.playerNames) })}</p>
            ) : null}
            {state.usedQuickJudgment ? (
              <p>{t('result.vote.quickJudge', { players: formatPlayers(state.votedOutIndices, state.config.playerNames) })}</p>
            ) : null}
          </>
        ) : null}
      </div>

      {showSummary ? (
        <>
          <div className="highlight-list">
            {mostSuspicious?.votes > 0 ? (
              <div className="highlight-row">
                <span>{t('result.highlight.suspicious')}</span>
                <b>{formatPlayers(mostSuspicious.indices, state.config.playerNames)} · {t('result.highlight.votes', { count: mostSuspicious.votes })}</b>
              </div>
            ) : null}
            {unfairCitizen?.votes > 0 ? (
              <div className="highlight-row">
                <span>{t('result.highlight.unfair')}</span>
                <b>{formatPlayers(unfairCitizen.indices, state.config.playerNames)}</b>
              </div>
            ) : null}
            {highlights.hiddenLiars?.length ? (
              <div className="highlight-row">
                <span>{t('result.highlight.hiddenLiar')}</span>
                <b>{formatPlayers(highlights.hiddenLiars, state.config.playerNames)}</b>
              </div>
            ) : null}
            {highlights.reversalLiars?.length ? (
              <div className="highlight-row">
                <span>{t('result.highlight.reversal')}</span>
                <b>{formatPlayers(highlights.reversalLiars, state.config.playerNames)}</b>
              </div>
            ) : null}
            {highlights.chaos ? (
              <div className="highlight-row">
                <span>{t('result.highlight.chaos')}</span>
                <b>{formatPlayers(state.votedOutIndices, state.config.playerNames)}</b>
              </div>
            ) : null}
          </div>
          <Scoreboard scores={state.scores} delta={state.lastDelta} liarIndices={state.liarIndices} playerNames={state.config.playerNames} />
        </>
      ) : null}
      <button className="primary-btn wide" type="button" onClick={advance}>
        {buttonLabel}
      </button>
    </div>
  );
}
