import { useState } from 'react';
import { getVotedOutIndices, totalVotes } from '../logic/voting.js';
import { useGame } from '../store/gameStore.jsx';

export default function VoteScreen() {
  const { state, dispatch } = useGame();
  const [votes, setVotes] = useState(new Array(state.config.playerCount).fill(0));
  const voteTotal = totalVotes(votes);
  const canAddVote = voteTotal < state.config.playerCount;
  const changeVote = (index, delta) => setVotes(prev => {
    const currentTotal = totalVotes(prev);
    if (delta > 0 && currentTotal >= state.config.playerCount) return prev;
    if (delta < 0 && prev[index] <= 0) return prev;
    return prev.map((value, i) => (i === index ? value + delta : value));
  });

  const submit = () => {
    if (voteTotal === 0) return;
    const votedOutIndices = getVotedOutIndices(votes);
    dispatch({ type: 'SET_VOTE', votedOutIndices });
  };

  return (
    <div className="screen vote">
      <h2 className="section-title">라이어 투표</h2>
      <div className="vote-grid">
        {votes.map((value, index) => (
          <div className="vote-row" key={index}>
            <span className="vote-num">{index + 1}번</span>
            <button type="button" disabled={value === 0} onClick={() => changeVote(index, -1)} aria-label={`${index + 1}번 표 빼기`}>-</button>
            <span className="vote-cnt">{value}</span>
            <button type="button" disabled={!canAddVote} onClick={() => changeVote(index, 1)} aria-label={`${index + 1}번 표 더하기`}>+</button>
          </div>
        ))}
      </div>
      <button className="primary-btn" type="button" disabled={voteTotal === 0} onClick={submit}>투표 확정</button>
    </div>
  );
}
