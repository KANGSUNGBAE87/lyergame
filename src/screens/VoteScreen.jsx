import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { getVotedOutIndices, totalVotes } from '../logic/voting.js';
import { useGame } from '../store/gameStore.jsx';

export default function VoteScreen() {
  const { state, dispatch } = useGame();
  const { t } = useI18n();
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
      <h2 className="section-title">{t('vote.title')}</h2>
      <p className="hint">{t('vote.help')}</p>
      <div className="vote-grid">
        {votes.map((value, index) => (
          <div className="vote-row" key={index}>
            <span className="vote-num">{t('common.playerNumber', { num: index + 1 })}</span>
            <button type="button" disabled={value === 0} onClick={() => changeVote(index, -1)} aria-label={t('vote.minus', { num: index + 1 })}>-</button>
            <span className="vote-cnt">{value}</span>
            <button type="button" disabled={!canAddVote} onClick={() => changeVote(index, 1)} aria-label={t('vote.plus', { num: index + 1 })}>+</button>
          </div>
        ))}
      </div>
      <button className="primary-btn" type="button" disabled={voteTotal === 0} onClick={submit}>{t('vote.submit')}</button>
    </div>
  );
}
