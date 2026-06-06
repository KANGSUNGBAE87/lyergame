import Timer from '../components/Timer.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useGame } from '../store/gameStore.jsx';

export default function DiscussScreen() {
  const { state, dispatch } = useGame();
  const { t } = useI18n();
  const goVote = () => dispatch({ type: 'GO_VOTE' });

  return (
    <div className="screen discuss">
      <h2 className="section-title">{t('discuss.title')}</h2>
      <p className="hint">{t('discuss.help')}</p>
      {state.config.timerMin > 0 ? <Timer minutes={state.config.timerMin} onDone={goVote} /> : <p className="hint">{t('discuss.noTimer')}</p>}
      <button className="primary-btn" type="button" onClick={goVote}>{t('discuss.goVote')}</button>
    </div>
  );
}
