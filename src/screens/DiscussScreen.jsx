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
      <div className="discussion-mission-card">
        <div className="mission-card-head">
          <span className="mission-badge">{t('discuss.missionBadge')}</span>
          <span className="mission-rule">{t('discuss.ruleBadge')}</span>
        </div>
        <p>
          <strong>{t('discuss.keyword.noWord')}</strong>{t('discuss.missionLine1')}
        </p>
        <p>
          <strong>{t('discuss.keyword.explain')}</strong>{t('discuss.missionLine2')}
          <strong>{t('discuss.keyword.findLiar')}</strong>{t('discuss.missionLine3')}
        </p>
        {state.config.timerMin > 0 ? (
          <Timer minutes={state.config.timerMin} onDone={goVote} />
        ) : (
          <span className="timer-pill">{t('discuss.noTimer')}</span>
        )}
      </div>
      <button className="primary-btn" type="button" onClick={goVote}>{t('discuss.goVote')}</button>
    </div>
  );
}
