const LIAR_SVG = (
  <svg className="liar-svg" viewBox="0 0 280 260" aria-hidden="true">
    <ellipse cx="140" cy="140" rx="82" ry="86" fill="#ffe0bd" stroke="#c8956d" strokeWidth="3.5" />
    <circle cx="174" cy="129" r="11" fill="#222" />
    <circle cx="177" cy="125" r="4" fill="#fff" />
    <path d="M 88 130 Q 104 119 120 130" stroke="#222" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M 140 158 L 268 162 Q 276 168 268 173 L 140 172 Z" fill="#ffc99a" stroke="#c8956d" strokeWidth="3" />
    <path d="M 105 198 Q 128 215 145 205 Q 165 215 188 198" stroke="#222" strokeWidth="6" fill="none" strokeLinecap="round" />
  </svg>
);

export default function PeekModal({ active, isLiar, category, word, liarHint }) {
  return (
    <div className={'peek-modal' + (active ? ' active' : '')}>
      <div className="peek-card">
        {isLiar ? (
          <>
            {LIAR_SVG}
            <div className="pc-liar-label">라이어</div>
            {liarHint ? <div className="pc-category">카테고리: {category}</div> : null}
          </>
        ) : (
          <>
            <div className="pc-category">{category}</div>
            <div className="pc-word">{word}</div>
          </>
        )}
      </div>
    </div>
  );
}
