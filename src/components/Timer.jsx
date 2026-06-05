import { useEffect, useState } from 'react';

export default function Timer({ minutes, onDone }) {
  const [left, setLeft] = useState(minutes * 60);

  useEffect(() => {
    if (left <= 0) {
      onDone?.();
      return undefined;
    }
    const timeout = setTimeout(() => setLeft(value => value - 1), 1000);
    return () => clearTimeout(timeout);
  }, [left, onDone]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return <div className="timer">{mm}:{ss}</div>;
}
