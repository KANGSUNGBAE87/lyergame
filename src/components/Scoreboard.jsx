export default function Scoreboard({ scores, delta = [], liarIndices = [] }) {
  const ranked = scores
    .map((score, index) => ({ score, index, delta: delta[index] || 0 }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return (
    <div className="scoreboard">
      {ranked.map(({ score, index, delta: change }) => (
        <div className="sb-row" key={index}>
          <span className="sb-name">{index + 1}번{liarIndices.includes(index) ? ' · 라이어' : ''}</span>
          <span className="sb-score">
            {score}
            {change ? <em className="sb-delta">+{change}</em> : null}
          </span>
        </div>
      ))}
    </div>
  );
}
