import { useState } from 'react';
import { haptic } from '../core/haptic.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { playerLabel, playerNameWithNumber } from '../logic/players.js';
import { buildVoteCounts, getSelectableCandidateIndices, getTopVotedIndices } from '../logic/voting.js';
import { useGame } from '../store/gameStore.jsx';

function createEmptyVotes(playerCount) {
  return new Array(playerCount).fill(null);
}

export default function VoteScreen() {
  const { state, dispatch } = useGame();
  const { t } = useI18n();
  const playerCount = state.config.playerCount;
  const [session, setSession] = useState({
    isRunoff: false,
    candidates: null,
    votesByVoter: createEmptyVotes(playerCount),
    previousVoteCounts: [],
    previousVotesByVoter: [],
  });
  const [currentVoter, setCurrentVoter] = useState(0);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [tie, setTie] = useState(null);
  const selectedTarget = session.votesByVoter[currentVoter];
  const voterName = playerNameWithNumber(currentVoter, state.config.playerNames);
  const choices = getSelectableCandidateIndices({
    playerCount,
    voterIndex: currentVoter,
    runoffCandidates: session.candidates,
  });

  const voteSummary = (counts, candidates) => candidates
    .map(index => t('vote.patternItem', {
      player: playerNameWithNumber(index, state.config.playerNames),
      count: counts[index],
    }))
    .join(' · ');

  const dispatchVote = ({ votedOutIndices, voteCounts, votesByVoter, runoffOf = [], runoffVoteCounts = [], runoffVotesByVoter = [], usedQuickJudgment = false }) => {
    dispatch({
      type: 'SET_VOTE',
      votedOutIndices,
      voteCounts,
      votesByVoter,
      runoffOf,
      runoffVoteCounts,
      runoffVotesByVoter,
      usedQuickJudgment,
    });
  };

  const finishSession = votesByVoter => {
    const voteCounts = buildVoteCounts(votesByVoter, playerCount);
    const topCandidates = getTopVotedIndices(voteCounts);

    if (topCandidates.length > 1 && !session.isRunoff) {
      setTie({
        candidates: topCandidates,
        voteCounts,
        votesByVoter,
      });
      setHandoffOpen(false);
      return;
    }

    dispatchVote({
      votedOutIndices: topCandidates,
      voteCounts,
      votesByVoter: session.isRunoff ? session.previousVotesByVoter : votesByVoter,
      runoffOf: session.isRunoff ? session.candidates : [],
      runoffVoteCounts: session.isRunoff ? voteCounts : [],
      runoffVotesByVoter: session.isRunoff ? votesByVoter : [],
      usedQuickJudgment: session.isRunoff && topCandidates.length > 1,
    });
  };

  const chooseTarget = targetIndex => {
    setSession(prev => ({
      ...prev,
      votesByVoter: prev.votesByVoter.map((value, index) => (index === currentVoter ? targetIndex : value)),
    }));
  };

  const confirmVote = () => {
    if (selectedTarget === null) return;
    haptic();
    setHandoffOpen(true);
  };

  const continueAfterVote = () => {
    if (currentVoter >= playerCount - 1) {
      finishSession(session.votesByVoter);
      return;
    }
    setCurrentVoter(value => value + 1);
    setHandoffOpen(false);
  };

  const startRunoff = () => {
    setSession({
      isRunoff: true,
      candidates: tie.candidates,
      votesByVoter: createEmptyVotes(playerCount),
      previousVoteCounts: tie.voteCounts,
      previousVotesByVoter: tie.votesByVoter,
    });
    setCurrentVoter(0);
    setTie(null);
    setHandoffOpen(false);
  };

  const quickJudge = () => {
    dispatchVote({
      votedOutIndices: tie.candidates,
      voteCounts: tie.voteCounts,
      votesByVoter: tie.votesByVoter,
      usedQuickJudgment: true,
    });
  };

  if (tie) {
    return (
      <div className="screen vote">
        <p className="eyebrow">{t('vote.tie.eyebrow')}</p>
        <h2 className="section-title">{t('vote.tie.title')}</h2>
        <p className="hint">{t('vote.tie.help')}</p>
        <div className="vote-pattern">
          {voteSummary(tie.voteCounts, tie.candidates)}
        </div>
        <div className="manual">
          <button className="primary-btn wide" type="button" onClick={startRunoff}>{t('vote.tie.revote')}</button>
          <button className="ghost-btn" type="button" onClick={quickJudge}>{t('vote.tie.quickJudge')}</button>
        </div>
      </div>
    );
  }

  if (handoffOpen) {
    const isLast = currentVoter >= playerCount - 1;

    return (
      <div className="screen handoff">
        <div className="handoff-panel">
          <p className="eyebrow">{t('vote.handoff.saved', { player: playerLabel(currentVoter, state.config.playerNames) })}</p>
          <h2 className="section-title">{isLast ? t('vote.handoff.finishTitle') : t('vote.handoff.title')}</h2>
          <p className="hint">
            {isLast
              ? t('vote.handoff.finishHelp')
              : t('vote.handoff.next', { player: playerNameWithNumber(currentVoter + 1, state.config.playerNames) })}
          </p>
          <button className="primary-btn wide" type="button" onClick={continueAfterVote}>
            {isLast ? t('vote.handoff.finishButton') : t('vote.handoff.nextButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen vote">
      <p className="eyebrow">{session.isRunoff ? t('vote.runoff.eyebrow') : t('vote.eyebrow', { current: currentVoter + 1, total: playerCount })}</p>
      <h2 className="section-title">{session.isRunoff ? t('vote.runoff.title') : t('vote.title')}</h2>
      <p className="hint">
        {session.isRunoff
          ? t('vote.runoff.help', { player: voterName })
          : t('vote.secretHelp', { player: voterName })}
      </p>
      {session.isRunoff ? (
        <div className="vote-pattern">{voteSummary(session.previousVoteCounts, session.candidates)}</div>
      ) : null}
      <div className="vote-choice-grid">
        {choices.map(index => (
          <button
            key={index}
            className={selectedTarget === index ? 'vote-choice on' : 'vote-choice'}
            type="button"
            onClick={() => chooseTarget(index)}
          >
            <span>{playerLabel(index, state.config.playerNames)}</span>
            <small>{t('common.playerNumber', { num: index + 1 })}</small>
          </button>
        ))}
      </div>
      <button className="primary-btn wide" type="button" disabled={selectedTarget === null} onClick={confirmVote}>
        {t('vote.save')}
      </button>
    </div>
  );
}
