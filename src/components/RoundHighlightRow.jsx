import React from 'react';

const ICONS = {
  suspicious: (
    <>
      <circle cx="17" cy="17" r="7" />
      <path d="M22 22 L29 29" />
    </>
  ),
  unfair: (
    <>
      <path d="M18 6 C25 15 29 22 18 30 C7 22 11 15 18 6 Z" fill="currentColor" stroke="none" opacity="0.78" />
      <path d="M14 22 Q18 25 22 22" />
    </>
  ),
  hidden: (
    <>
      <path d="M7 17 Q18 8 29 17 Q24 27 18 27 Q12 27 7 17 Z" fill="currentColor" stroke="none" opacity="0.16" />
      <path d="M7 17 Q18 8 29 17 Q24 27 18 27 Q12 27 7 17 Z" />
      <circle cx="14" cy="17" r="2.4" />
      <circle cx="22" cy="17" r="2.4" />
    </>
  ),
  reversal: (
    <>
      <path d="M27 12 H18 C12 12 8 16 8 21 C8 26 12 30 18 30 C23 30 27 27 28 22" />
      <path d="M22 7 L28 12 L22 17" />
    </>
  ),
  chaos: (
    <>
      <path d="M18 7 C27 8 30 18 23 23 C16 29 7 24 9 16 C11 9 21 12 21 18" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
};

export default function RoundHighlightRow({ type = 'suspicious', label, value }) {
  return (
    <div className={`highlight-row highlight-${type}`}>
      <span className="highlight-label">
        <span className={`highlight-icon ${type}`} aria-hidden="true">
          <svg viewBox="0 0 36 36" focusable="false">
            {ICONS[type] ?? ICONS.suspicious}
          </svg>
        </span>
        <span>{label}</span>
      </span>
      <b>{value}</b>
    </div>
  );
}
