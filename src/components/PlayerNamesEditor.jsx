import React from 'react';
import { buildPlayerNames } from '../logic/players.js';

export default function PlayerNamesEditor({
  playerCount,
  playerNames,
  label,
  summary,
  help,
  closedLabel,
  openLabel,
  placeholderLabel,
  clearLabel,
  onChange,
  onClear,
}) {
  const names = buildPlayerNames(playerNames, playerCount).slice(0, playerCount);
  const hasNames = names.some(Boolean);

  return (
    <details className="field names-box">
      <summary>
        <span className="name-summary-main">
          <span>{label}</span>
          <small>{hasNames ? summary : help}</small>
        </span>
        <span className="name-summary-action" aria-hidden="true">
          <span className="name-toggle-label closed">{closedLabel}</span>
          <span className="name-toggle-label open">{openLabel}</span>
          <span className="summary-chevron" />
        </span>
      </summary>
      <div className="names-collapse">
        <div className="names-collapse-inner">
          <div className="names-grid">
            {names.map((name, index) => (
              <label className="name-input-row" key={index}>
                <span>{index + 1}</span>
                <input
                  type="text"
                  value={name}
                  inputMode="text"
                  maxLength={12}
                  placeholder={placeholderLabel(index + 1)}
                  onChange={event => onChange(index, event.target.value)}
                />
              </label>
            ))}
          </div>
          <button className="mini-ghost" type="button" disabled={!hasNames} onClick={onClear}>
            {clearLabel}
          </button>
        </div>
      </div>
    </details>
  );
}
