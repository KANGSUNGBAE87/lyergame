import { useState } from 'react';
import { DIFFICULTY_OPTIONS, MAX_PLAYERS, MIN_PLAYERS, ROUND_OPTIONS, TIMER_OPTIONS } from '../config/gameOptions.js';
import { CATEGORIES } from '../data/words.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { LOCALES } from '../i18n/messages.js';
import { useGame } from '../store/gameStore.jsx';

export default function SetupScreen() {
  const { dispatch } = useGame();
  const { locale, setLocale, t, categoryLabel } = useI18n();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [config, setConfig] = useState({
    playerCount: 6,
    liarCount: 1,
    categories: [],
    difficulty: 0,
    liarHint: true,
    totalRounds: 3,
    timerMin: 0,
  });

  const set = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));
  const setPlayerCount = playerCount => setConfig(prev => ({
    ...prev,
    playerCount,
    liarCount: playerCount < 6 ? 1 : prev.liarCount,
  }));
  const toggleCategory = category => setConfig(prev => ({
    ...prev,
    categories: prev.categories.includes(category)
      ? prev.categories.filter(item => item !== category)
      : [...prev.categories, category],
  }));
  const currentLocale = LOCALES.find(item => item.code === locale);
  const chooseLocale = nextLocale => {
    setLocale(nextLocale);
    setLanguageOpen(false);
  };

  return (
    <div className="screen setup">
      <div className="locale-menu">
        <button
          className="locale-trigger"
          type="button"
          aria-expanded={languageOpen}
          onClick={() => setLanguageOpen(open => !open)}
        >
          <span>{t('setup.language.trigger')}</span>
          <b>{currentLocale?.label ?? locale}</b>
        </button>
        {languageOpen ? (
          <div className="locale-popover" role="menu">
            <div className="locale-popover-title">{t('setup.language.label')}</div>
            {LOCALES.map(item => (
              <button key={item.code} type="button" role="menuitemradio" aria-checked={locale === item.code} onClick={() => chooseLocale(item.code)}>
                <span className="locale-check" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="setup-head">
        <h1 className="title">{t('app.title')}</h1>
        <p className="subtitle">{t('app.subtitle')}</p>
      </div>

      <details className="field category-box guide-box" open>
        <summary>{t('setup.guide.title')}</summary>
        <p className="guide-copy">{t('setup.guide.copy')}</p>
        <ol className="guide-list">
          <li>{t('setup.guide.step1')}</li>
          <li>{t('setup.guide.step2')}</li>
          <li>{t('setup.guide.step3')}</li>
        </ol>
      </details>

      <label className="field">
        <span>{t('setup.playerCount.label', { count: config.playerCount })}</span>
        <p className="field-help">{t('setup.playerCount.help')}</p>
        <input
          type="range"
          min={MIN_PLAYERS}
          max={MAX_PLAYERS}
          value={config.playerCount}
          onChange={event => setPlayerCount(Number(event.target.value))}
        />
      </label>

      <div className="field">
        <span>{t('setup.liarCount.label')}</span>
        <p className="field-help">{t('setup.liarCount.help')}</p>
        <div className="seg">
          <button className={config.liarCount === 1 ? 'on' : ''} type="button" onClick={() => set('liarCount', 1)}>{t('setup.liarCount.one')}</button>
          <button className={config.liarCount === 2 ? 'on' : ''} type="button" disabled={config.playerCount < 6} onClick={() => set('liarCount', 2)}>{t('setup.liarCount.two')}</button>
        </div>
      </div>

      <div className="field">
        <span>{t('setup.difficulty.label')}</span>
        <p className="field-help">{t('setup.difficulty.help')}</p>
        <div className="seg">
          {DIFFICULTY_OPTIONS.map(value => (
            <button key={value} className={config.difficulty === value ? 'on' : ''} type="button" onClick={() => set('difficulty', value)}>
              {t(`setup.difficulty.${value}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>{t('setup.rounds.label')}</span>
        <p className="field-help">{t('setup.rounds.help')}</p>
        <div className="seg">
          {ROUND_OPTIONS.map(value => (
            <button key={value} className={config.totalRounds === value ? 'on' : ''} type="button" onClick={() => set('totalRounds', value)}>
              {t('common.roundShort', { round: value })}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>{t('setup.timer.label')}</span>
        <p className="field-help">{t('setup.timer.help')}</p>
        <div className="seg">
          {TIMER_OPTIONS.map(value => (
            <button key={value} className={config.timerMin === value ? 'on' : ''} type="button" onClick={() => set('timerMin', value)}>
              {value === 0 ? t('setup.timer.none') : t('setup.timer.minutes', { minutes: value })}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="switch-row">
          <input type="checkbox" checked={config.liarHint} onChange={event => set('liarHint', event.target.checked)} />
          <span>{t('setup.liarHint.label')}</span>
        </label>
        <p className="field-help">{t('setup.liarHint.help')}</p>
      </div>

      <details className="field category-box">
        <summary>{config.categories.length ? t('setup.categories.summarySelected', { count: config.categories.length }) : t('setup.categories.summaryAll')}</summary>
        <p className="field-help">{t('setup.categories.help')}</p>
        <div className="cat-grid">
          {CATEGORIES.map(category => (
            <button key={category} className={config.categories.includes(category) ? 'on' : ''} type="button" onClick={() => toggleCategory(category)}>
              {categoryLabel(category)}
            </button>
          ))}
        </div>
      </details>

      <div className="setup-actions">
        <button className="primary-btn" type="button" onClick={() => dispatch({ type: 'START', config: { ...config, locale } })}>{t('setup.start')}</button>
        <button className="ghost-btn" type="button" onClick={() => dispatch({ type: 'GO', phase: 'history' })}>{t('setup.history')}</button>
      </div>
    </div>
  );
}
