import React from 'react';

export default function VoteResultBars({
  label,
  rows = [],
  countLabel = count => `${count}`,
  candidateLabel = '',
  compact = false,
}) {
  if (!rows.length) return null;

  return (
    <div className={compact ? 'vote-result-bars compact' : 'vote-result-bars'} aria-label={label}>
      <div className="vote-result-title">
        <span>{label}</span>
        <b>{countLabel(rows[0].count)}</b>
      </div>
      <div className="vote-result-list">
        {rows.map(row => {
          const width = row.count > 0 ? Math.max(row.percent, 8) : 0;

          return (
            <div className={row.isCandidate ? 'vote-result-row candidate' : 'vote-result-row'} key={row.index}>
              <div className="vote-result-row-head">
                <span>{row.player}</span>
                {row.isCandidate ? <em>{candidateLabel}</em> : null}
                <b>{countLabel(row.count)}</b>
              </div>
              <div className="vote-result-track" aria-hidden="true">
                <i style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
