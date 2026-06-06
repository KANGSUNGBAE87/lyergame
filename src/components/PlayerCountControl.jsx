import React from 'react';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function PlayerCountControl({
  value,
  min,
  max,
  presets,
  label,
  help,
  valueLabel,
  decreaseLabel,
  increaseLabel,
  presetLabel,
  onChange,
}) {
  const setValue = nextValue => onChange(clamp(nextValue, min, max));

  return (
    <div className="field player-count-field">
      <div className="player-count-head">
        <span>{label}</span>
        <small>{help}</small>
      </div>
      <div className="player-stepper" aria-label={label}>
        <button type="button" aria-label={decreaseLabel} disabled={value <= min} onClick={() => setValue(value - 1)}>
          -
        </button>
        <strong>{valueLabel}</strong>
        <button type="button" aria-label={increaseLabel} disabled={value >= max} onClick={() => setValue(value + 1)}>
          +
        </button>
      </div>
      <div className="player-presets">
        {presets.map(preset => (
          <button
            key={preset}
            className={value === preset ? 'on' : ''}
            type="button"
            aria-label={presetLabel(preset)}
            onClick={() => setValue(preset)}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
