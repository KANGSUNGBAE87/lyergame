import { useMemo } from 'react';
import { WORDS } from '../data/words.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useGame } from '../store/gameStore.jsx';

export default function ReversalScreen() {
  const { state, dispatch } = useGame();
  const { t, categoryLabel } = useI18n();
  const caughtLiars = state.votedOutIndices.filter(index => state.liarIndices.includes(index));
  const caughtPlayers = caughtLiars.map(index => index + 1).join(', ');
  const translatedCategory = categoryLabel(state.category);
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
      <h2 className="section-title">{t('reversal.title')}</h2>
      <p className="hint">{t('reversal.caught', { players: caughtPlayers })}</p>
      <p className="hint">{t('reversal.help')}<br />{t('peekModal.category', { category: translatedCategory })}</p>
      <div className="choice-grid">
        {choices.map(choice => (
          <button key={choice} className="choice" type="button" onClick={() => decide(choice === state.word)}>
            {choice}
          </button>
        ))}
      </div>
      <div className="manual">
        <button className="primary-btn compact" type="button" onClick={() => decide(true)}>{t('reversal.correct')}</button>
        <button className="ghost-btn" type="button" onClick={() => decide(false)}>{t('reversal.wrong')}</button>
      </div>
    </div>
  );
}
