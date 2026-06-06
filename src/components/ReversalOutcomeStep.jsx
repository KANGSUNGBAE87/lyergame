import React from 'react';
import LiarMascot from './LiarMascot.jsx';

function withPlayers(template, caughtPlayers) {
  return template.replace('{players}', caughtPlayers);
}

export default function ReversalOutcomeStep({
  step,
  success,
  caughtPlayers,
  word,
  categoryText,
  labels,
  onNext,
}) {
  const isAnswer = step === 'answer';
  const isJudgment = step === 'judgment';
  const badgeClass = step === 'handoff'
    ? 'neutral'
    : (success ? 'success' : 'miss');
  const title = step === 'handoff'
    ? labels.handoffTitle
    : (success ? labels.correctTitle : labels.wrongTitle);
  const help = step === 'handoff'
    ? withPlayers(labels.handoffHelp, caughtPlayers)
    : (success ? labels.correctHelp : labels.wrongHelp);
  const buttonLabel = step === 'handoff'
    ? labels.handoffCta
    : (isJudgment ? labels.answerCta : labels.resultCta);

  return (
    <div className={`screen reversal reversal-outcome outcome-${step}`}>
      <div className="reversal-outcome-card">
        <div className={`outcome-badge ${badgeClass}`}>
          <LiarMascot className="liar-mascot outcome-mascot" />
        </div>
        <h2 className="section-title">{isAnswer ? labels.answerTitle : title}</h2>
        <p className="hint">{isAnswer ? withPlayers(labels.handoffHelp, caughtPlayers) : help}</p>
        {isAnswer ? (
          <div className="answer-reveal-card">
            <span>{labels.answerLabel}</span>
            <b>{word}</b>
            <small>{categoryText}</small>
          </div>
        ) : null}
        <button className="primary-btn wide" type="button" onClick={onNext}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
