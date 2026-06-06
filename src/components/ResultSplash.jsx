import React from 'react';

export default function ResultSplash({ label }) {
  return (
    <div className="result-splash" role="img" aria-label={label}>
      <svg className="result-splash-art" viewBox="0 0 180 72" aria-hidden="true" focusable="false">
        <path className="splash-ribbon left" d="M58 36 C42 24 26 21 10 26 C20 35 32 42 48 44 Z" />
        <path className="splash-ribbon right" d="M122 36 C138 24 154 21 170 26 C160 35 148 42 132 44 Z" />
        <path className="splash-burst" d="M90 8 L98 29 L120 18 L108 40 L132 46 L107 51 L118 68 L94 56 L90 70 L86 56 L62 68 L73 51 L48 46 L72 40 L60 18 L82 29 Z" />
        <circle className="splash-dot dot-a" cx="28" cy="13" r="5" />
        <circle className="splash-dot dot-b" cx="150" cy="13" r="5" />
        <circle className="splash-dot dot-c" cx="38" cy="60" r="4" />
        <circle className="splash-dot dot-d" cx="142" cy="60" r="4" />
        <path className="splash-spark" d="M21 48 L16 43 M21 48 L15 51" />
        <path className="splash-spark" d="M159 48 L164 43 M159 48 L165 51" />
        <path className="splash-spark" d="M75 7 L72 1 M105 7 L108 1" />
      </svg>
    </div>
  );
}
