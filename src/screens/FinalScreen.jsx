import { useEffect, useRef } from 'react';
import Scoreboard from '../components/Scoreboard.jsx';
import { saveGameRecord, useGame } from '../store/gameStore.jsx';

export default function FinalScreen() {
  const { state, dispatch } = useGame();
  const saved = useRef(false);
  const maxScore = Math.max(...state.scores);
  const winners = state.scores.map((score, index) => (score === maxScore ? index + 1 : null)).filter(Boolean);

  useEffect(() => {
    if (!saved.current) {
      saved.current = true;
      void saveGameRecord(state);
    }
  }, [state]);

  return (
    <div className="screen final">
      <h1 className="big-title">게임 종료</h1>
      <p className="hint">우승 {winners.join(', ')}번 · {maxScore}점</p>
      <Scoreboard scores={state.scores} />
      <button className="primary-btn" type="button" onClick={() => dispatch({ type: 'RESET' })}>새 게임</button>
      <button className="ghost-btn" type="button" onClick={() => dispatch({ type: 'GO', phase: 'history' })}>기록 보기</button>
    </div>
  );
}
