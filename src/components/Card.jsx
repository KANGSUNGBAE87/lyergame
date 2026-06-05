export default function Card({ idx, used, onClick }) {
  return (
    <button
      className={'card' + (used ? ' used' : '')}
      type="button"
      disabled={used}
      onClick={onClick}
      aria-label={`${idx + 1}번 카드`}
    >
      <span className="card-mark">?</span>
      <span className="card-num">{idx + 1}번</span>
    </button>
  );
}
