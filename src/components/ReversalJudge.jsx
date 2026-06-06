import React from 'react';

export default function ReversalJudge({
  title,
  voteResultLabel,
  voteResultText,
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
        {voteResultText ? (
          <div className="reversal-vote-result">
            <span>{voteResultLabel}</span>
            <b>{voteResultText}</b>
          </div>
        ) : null}
        {verdictText ? <p className="reversal-verdict">{verdictText}</p> : null}
        <p className="reversal-caught">{caughtText}</p>
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
