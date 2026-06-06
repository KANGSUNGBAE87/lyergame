import React from 'react';

export default function LiarMascot({ className = 'liar-svg' }) {
  return (
    <svg className={className} viewBox="0 0 280 260" aria-hidden="true">
      <ellipse cx="140" cy="140" rx="82" ry="86" fill="#ffe0bd" stroke="#c8956d" strokeWidth="3.5" />
      <circle cx="174" cy="129" r="11" fill="#222" />
      <circle cx="177" cy="125" r="4" fill="#fff" />
      <path d="M 88 130 Q 104 119 120 130" stroke="#222" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M 140 158 L 268 162 Q 276 168 268 173 L 140 172 Z" fill="#ffc99a" stroke="#c8956d" strokeWidth="3" />
      <path d="M 105 198 Q 128 215 145 205 Q 165 215 188 198" stroke="#222" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
