import { useState } from 'react';
import ReversalJudge from '../components/ReversalJudge.jsx';
import ReversalOutcomeStep from '../components/ReversalOutcomeStep.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { playerNameWithNumber } from '../logic/players.js';
import { createVoteResultRows } from '../logic/voteResults.js';
import { useGame } from '../store/gameStore.jsx';

export default function ReversalScreen() {
  const { state, dispatch } = useGame();
  const { t, categoryLabel } = useI18n();
  const [outcome, setOutcome] = useState({ step: 'judge', success: false });
  const caughtLiars = state.votedOutIndices.filter(index => state.liarIndices.includes(index));
  const caughtPlayers = caughtLiars.map(index => playerNameWithNumber(index, state.config.playerNames)).join(', ');
  const voteRows = createVoteResultRows({
    voteCounts: state.voteCounts,
    playerNames: state.config.playerNames,
    candidateIndices: state.votedOutIndices,
  });
  const voteResultText = state.votedOutIndices
    .map(index => t('result.vote.item', {
      player: playerNameWithNumber(index, state.config.playerNames),
      count: state.voteCounts[index] ?? 0,
    }))
    .join(' · ');
  const translatedCategory = categoryLabel(state.category);
  const categoryText = t('peekModal.category', { category: translatedCategory });
  const decide = success => setOutcome({ step: 'handoff', success });
  const labels = {
    handoffTitle: t('reversal.handoff.title'),
    handoffHelp: t('reversal.handoff.help'),
    handoffCta: t('reversal.handoff.cta'),
    correctTitle: t('reversal.outcome.correctTitle'),
    wrongTitle: t('reversal.outcome.wrongTitle'),
    correctHelp: t('reversal.outcome.correctHelp'),
    wrongHelp: t('reversal.outcome.wrongHelp'),
    answerCta: t('reversal.answer.cta'),
    answerTitle: t('reversal.answer.title'),
    answerLabel: t('reversal.answer.label'),
    resultCta: t('reversal.answer.resultCta'),
  };
  const advanceOutcome = () => {
    if (outcome.step === 'handoff') {
      setOutcome(prev => ({ ...prev, step: 'judgment' }));
      return;
    }
    if (outcome.step === 'judgment') {
      setOutcome(prev => ({ ...prev, step: 'answer' }));
      return;
    }
    dispatch({ type: 'SET_REVERSAL', success: outcome.success });
  };

  if (outcome.step !== 'judge') {
    return (
      <ReversalOutcomeStep
        step={outcome.step}
        success={outcome.success}
        caughtPlayers={caughtPlayers}
        word={state.word}
        categoryText={categoryText}
        labels={labels}
        onNext={advanceOutcome}
      />
    );
  }

  return (
    <ReversalJudge
      title={t('reversal.title')}
      voteResultLabel={t('reversal.voteResult')}
      voteResultText={voteResultText}
      voteRows={voteRows}
      countLabel={count => t('result.highlight.votes', { count })}
      candidateLabel={t('result.vote.candidateBadge')}
      verdictText={t('reversal.verdictCaught')}
      caughtText={t('reversal.caught', { players: caughtPlayers })}
      instruction={t('reversal.instruction')}
      citizenInstruction={t('reversal.citizenInstruction')}
      categoryText={state.config.liarHint ? categoryText : ''}
      correctLabel={t('reversal.correct')}
      wrongLabel={t('reversal.wrong')}
      onCorrect={() => decide(true)}
      onWrong={() => decide(false)}
    />
  );
}
