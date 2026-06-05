import { useState } from 'react';
import { useGame } from '../store/gameStore.jsx';

export default function VoteScreen() {
  const { state, dispatch } = useGame();
  const [votes, setVotes] = useState(new Array(state.config.playerCount).fill(0));
  const changeVote = (index, delta) => setVotes(prev => prev.map((value, i) => (i === index ? Math.max(0, value + delta) : value)));

  const submit = () => {
    const max = Math.max(...votes);
    const votedOutIndices = max > 0
      ? votes.map((value, index) => (value === max ? index : -1)).filter(index => index >= 0)
      : [];
    dispatch({ type: 'SET_VOTE', votedOutIndices });
  };

  return (
    <div className="screen vote">
      <h2 className="section-title">라이어 투표</h2>
      <div className="vote-grid">
        {votes.map((value, index) => (
          <div className="vote-row" key={index}>
            <span className="vote-num">{index + 1}번</span>
            <button type="button" onClick={() => changeVote(index, -1)} aria-label={`${index + 1}번 표 빼기`}>-</button>
            <span className="vote-cnt">{value}</span>
            <button type="button" onClick={() => changeVote(index, 1)} aria-label={`${index + 1}번 표 더하기`}>+</button>
          </div>
        ))}
      </div>
      <button className="primary-btn" type="button" onClick={submit}>투표 확정</button>
    </div>
  );
}
