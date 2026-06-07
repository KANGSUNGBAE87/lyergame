import LiarMascot from '../components/LiarMascot.jsx';
import ResultSplash from '../components/ResultSplash.jsx';
import RoundHighlightRow from '../components/RoundHighlightRow.jsx';
import Scoreboard from '../components/Scoreboard.jsx';
import VoteResultBars from '../components/VoteResultBars.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { playerNameWithNumber } from '../logic/players.js';
import { createVoteResultRows } from '../logic/voteResults.js';
import { useGame } from '../store/gameStore.jsx';

function formatPlayers(indices = [], playerNames = []) {
  return indices.map(index => playerNameWithNumber(index, playerNames)).join(', ');
}

export function shouldSkipResultCountdown() {
  return true;
}

export function shouldShowMostSuspiciousHighlight({ voteCaughtLiar, mostSuspicious }) {
  return !voteCaughtLiar && (mostSuspicious?.votes ?? 0) > 0;
}

export function shouldShowMissedStatusBelowTitle({ lastLiarWon, voteCaughtLiar }) {
  return Boolean(lastLiarWon && !voteCaughtLiar);
}

export default function ResultScreen() {
  const { state, dispatch } = useGame();
  const { t, categoryLabel } = useI18n();
  const isLastRound = state.round >= state.config.totalRounds;
  const lastRound = state.perRound[state.perRound.length - 1];
  const highlights = lastRound?.highlights ?? {};
  const liars = formatPlayers(state.liarIndices, state.config.playerNames);
  const judgmentCandidates = formatPlayers(state.votedOutIndices, state.config.playerNames);
  const voteRows = createVoteResultRows({
    voteCounts: state.voteCounts,
    playerNames: state.config.playerNames,
    candidateIndices: state.votedOutIndices,
  });
  const voteCaughtLiar = state.votedOutIndices.some(index => state.liarIndices.includes(index));
  const mostSuspicious = highlights.mostSuspicious;
  const unfairCitizen = highlights.unfairCitizen;
  const buttonLabel = isLastRound
    ? t('result.final')
    : t('result.nextRound', { round: state.round + 1, total: state.config.totalRounds });

  return (
    <div className="screen result">
      <p className="eyebrow">{t('result.round', { round: state.round })}</p>
      <ResultSplash label={t('result.countdown.revealed')} />
      <h2 className="section-title">{state.lastLiarWon ? t('result.liarWin') : t('result.citizenWin')}</h2>
      {shouldShowMissedStatusBelowTitle({ lastLiarWon: state.lastLiarWon, voteCaughtLiar }) ? (
        <p className="result-missed-note">{t('result.vote.missed')}</p>
      ) : null}
      <div className="reveal-panel">
        <div className="result-fact-row candidate-summary">
          <span>{t('result.vote.candidate')}</span>
          <b>{judgmentCandidates}</b>
        </div>
        <VoteResultBars
          label={t('result.vote.label')}
          rows={voteRows}
          countLabel={count => t('result.highlight.votes', { count })}
          candidateLabel={t('result.vote.candidateBadge')}
        />
        {voteCaughtLiar ? (
          <div className="result-judgment caught">
            {t('result.vote.caught')}
          </div>
        ) : null}
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
        {shouldShowMostSuspiciousHighlight({ voteCaughtLiar, mostSuspicious }) ? (
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
