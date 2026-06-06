import Scoreboard from '../components/Scoreboard.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useGame } from '../store/gameStore.jsx';

export default function ResultScreen() {
  const { state, dispatch } = useGame();
  const { t, categoryLabel } = useI18n();
  const isLastRound = state.round >= state.config.totalRounds;
  const liars = state.liarIndices.map(index => index + 1).join(', ');

  return (
    <div className="screen result">
      <h2 className="section-title">{state.lastLiarWon ? t('result.liarWin') : t('result.citizenWin')}</h2>
      <p className="hint">
        {t('result.wordLabel')} <b>{state.word}</b> · {categoryLabel(state.category)}<br />
        {t('result.liarLabel')} {liars}
      </p>
      <Scoreboard scores={state.scores} delta={state.lastDelta} liarIndices={state.liarIndices} />
      <button className="primary-btn" type="button" onClick={() => dispatch({ type: 'NEXT_ROUND' })}>
        {isLastRound ? t('result.final') : t('result.nextRound', { round: state.round + 1, total: state.config.totalRounds })}
      </button>
    </div>
  );
}
