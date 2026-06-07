import React from 'react';
import LiarMascot from './LiarMascot.jsx';
import VoteResultBars from './VoteResultBars.jsx';

export default function ReversalJudge({
  title,
  voteResultLabel,
  voteResultText,
  voteRows = [],
  countLabel = count => `${count}`,
  candidateLabel = '',
  verdictText,
  caughtText,
  instruction,
  citizenInstruction,
  categoryText,
  correctLabel,
  wrongLabel,
  onCorrect,
  onWrong,
}) {
  return (
    <div className="screen reversal">
      <h2 className="section-title">{title}</h2>
      <div className="reversal-card">
        {voteRows.length ? (
          <VoteResultBars
            label={voteResultLabel}
            rows={voteRows}
            countLabel={countLabel}
            candidateLabel={candidateLabel}
            compact
          />
        ) : voteResultText ? (
          <div className="reversal-vote-result">
            <span>{voteResultLabel}</span>
            <b>{voteResultText}</b>
          </div>
        ) : null}
        {verdictText ? <p className="reversal-verdict">{verdictText}</p> : null}
        <div className="reversal-reveal">
          <div className="reversal-mascot-ring">
            <LiarMascot className="liar-mascot reversal-mascot" />
          </div>
          <p className="reversal-caught">{caughtText}</p>
        </div>
        <p className="reversal-instruction">{instruction}</p>
        <p className="reversal-citizen">{citizenInstruction}</p>
        {categoryText ? <p className="reversal-category">{categoryText}</p> : null}
      </div>
      <div className="manual reversal-actions">
        <button className="primary-btn compact" type="button" onClick={onCorrect}>{correctLabel}</button>
        <button className="ghost-btn" type="button" onClick={onWrong}>{wrongLabel}</button>
      </div>
    </div>
  );
}
