import { useMemo } from 'react';
import { WORDS } from '../data/words.js';
import { useGame } from '../store/gameStore.jsx';

export default function ReversalScreen() {
  const { state, dispatch } = useGame();
  const caughtLiars = state.votedOutIndices.filter(index => state.liarIndices.includes(index));
  const choices = useMemo(() => {
    const pool = WORDS[state.category].map(item => item.w).filter(word => word !== state.word);
    const wrong = [];
    const copy = pool.slice();
    while (wrong.length < 3 && copy.length) {
      wrong.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return [...wrong, state.word].sort(() => Math.random() - 0.5);
  }, [state.category, state.word]);
  const decide = success => dispatch({ type: 'SET_REVERSAL', success });

  return (
    <div className="screen reversal">
      <h2 className="section-title">라이어 지목</h2>
      <p className="hint">{caughtLiars.map(index => index + 1).join(', ')}번이 제시어를 맞히면 역전승</p>
      <p className="hint">카테고리: <b>{state.category}</b></p>
      <div className="choice-grid">
        {choices.map(choice => (
          <button key={choice} className="choice" type="button" onClick={() => decide(choice === state.word)}>
            {choice}
          </button>
        ))}
      </div>
      <div className="manual">
        <button className="primary-btn compact" type="button" onClick={() => decide(true)}>맞혔다</button>
        <button className="ghost-btn" type="button" onClick={() => decide(false)}>틀렸다</button>
      </div>
    </div>
  );
}
