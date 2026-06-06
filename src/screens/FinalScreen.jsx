import { useEffect, useRef } from 'react';
import Scoreboard from '../components/Scoreboard.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { saveGameRecord, useGame } from '../store/gameStore.jsx';

export default function FinalScreen() {
  const { state, dispatch } = useGame();
  const { t } = useI18n();
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
      <h1 className="big-title">{t('final.title')}</h1>
      <p className="hint">{t('final.winner', { winners: winners.join(', '), score: maxScore })}</p>
      <Scoreboard scores={state.scores} />
      <button className="primary-btn" type="button" onClick={() => dispatch({ type: 'RESET' })}>{t('final.newGame')}</button>
      <button className="ghost-btn" type="button" onClick={() => dispatch({ type: 'GO', phase: 'history' })}>{t('final.history')}</button>
    </div>
  );
}
