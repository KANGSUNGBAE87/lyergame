import React from 'react';

export default function ReversalJudge({
  title,
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
