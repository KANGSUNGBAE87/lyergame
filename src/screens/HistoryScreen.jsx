import { useEffect, useState } from 'react';
import { AD_PLACEMENTS } from '../ads/adPlacements.js';
import { authProvider } from '../auth/authProvider.js';
import AdBannerSlot from '../components/AdBannerSlot.jsx';
import LoginPrompt from '../components/LoginPrompt.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { recordsRepository } from '../records/recordsRepository.js';
import { useGame } from '../store/gameStore.jsx';

export default function HistoryScreen() {
  const { state, dispatch } = useGame();
  const { locale, t } = useI18n();
  const [games, setGames] = useState(null);
  const backPhase = state.prevFrom && state.prevFrom !== 'history' ? state.prevFrom : 'setup';
  const dateLocale = locale === 'ko' ? 'ko-KR' : 'en-US';

  useEffect(() => {
    recordsRepository.listGames().then(setGames);
  }, []);

  return (
    <div className="screen history">
      <h2 className="section-title">{t('history.title')}</h2>
      {games === null ? <p className="hint">{t('common.loading')}</p> : null}
      {games?.length === 0 ? <p className="hint">{t('history.empty')}</p> : null}
      {games?.length ? (
        <div className="hist-list">
          {games.map((game, index) => (
            <div className="hist-row" key={`${game.date}-${index}`}>
              <div className="hist-date">{new Date(game.date).toLocaleString(dateLocale)}</div>
              <div className="hist-meta">
                {t('history.meta', {
                  players: game.playerCount,
                  rounds: game.rounds,
                  difficulty: t(`setup.difficulty.${game.difficulty ?? 0}`),
                  winners: game.winnerIndices.map(i => i + 1).join(', '),
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <LoginPrompt
        compact
        eyebrow={t('auth.history.eyebrow')}
        title={t('auth.history.title')}
        body={t('auth.history.body')}
        ctaLabel={t('auth.login')}
        statusText={t('auth.notReady')}
        onLogin={() => authProvider.login()}
      />
      <AdBannerSlot
        placementId={AD_PLACEMENTS.HISTORY_BANNER}
        label={t('ads.historyBanner.label')}
      />
      <button className="ghost-btn" type="button" onClick={() => dispatch({ type: 'GO', phase: backPhase })}>{t('common.back')}</button>
    </div>
  );
}
