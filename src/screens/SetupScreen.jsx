import { useState } from 'react';
import GuideDialog from '../components/GuideDialog.jsx';
import PlayerCountControl from '../components/PlayerCountControl.jsx';
import PlayerNamesEditor from '../components/PlayerNamesEditor.jsx';
import { DIFFICULTY_OPTIONS, MAX_PLAYERS, MIN_PLAYERS, PLAYER_PRESETS, ROUND_OPTIONS, TIMER_OPTIONS } from '../config/gameOptions.js';
import { CATEGORIES } from '../data/words.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { LOCALES } from '../i18n/messages.js';
import { buildPlayerNames, setPlayerName } from '../logic/players.js';
import { useGame } from '../store/gameStore.jsx';

const DEFAULT_SETUP_CONFIG = {
  playerCount: 6,
  liarCount: 1,
  categories: [],
  difficulty: 0,
  liarHint: true,
  totalRounds: 3,
  timerMin: 0,
  playerNames: buildPlayerNames([], 6),
};

export default function SetupScreen() {
  const { dispatch } = useGame();
  const { locale, setLocale, t, categoryLabel } = useI18n();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [config, setConfig] = useState(DEFAULT_SETUP_CONFIG);

  const set = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));
  const setPlayerCount = playerCount => setConfig(prev => ({
    ...prev,
    playerCount,
    liarCount: playerCount < 6 ? 1 : prev.liarCount,
    playerNames: buildPlayerNames(prev.playerNames, playerCount),
  }));
  const changePlayerName = (index, name) => setConfig(prev => ({
    ...prev,
    playerNames: setPlayerName(prev.playerNames, index, name),
  }));
  const clearPlayerNames = () => setConfig(prev => ({
    ...prev,
    playerNames: buildPlayerNames([], prev.playerCount),
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
  const advancedSummary = [
    t('setup.advanced.liars', { count: config.liarCount }),
    t(`setup.difficulty.${config.difficulty}`),
    t('common.roundShort', { round: config.totalRounds }),
    config.timerMin === 0 ? t('setup.timer.none') : t('setup.timer.minutes', { minutes: config.timerMin }),
    config.categories.length ? t('setup.categories.summarySelected', { count: config.categories.length }) : t('setup.categories.summaryAll'),
  ].join(' · ');
  const startGame = () => dispatch({
    type: 'START',
    config: {
      ...config,
      playerNames: buildPlayerNames(config.playerNames, config.playerCount),
      locale,
    },
  });
  const guideSections = [
    {
      title: t('setup.guide.goal.title'),
      items: [
        t('setup.guide.goal.citizens'),
        t('setup.guide.goal.liar'),
      ],
    },
    {
      title: t('setup.guide.flow.title'),
      items: [
        t('setup.guide.flow.setup'),
        t('setup.guide.flow.peek'),
        t('setup.guide.flow.clue'),
        t('setup.guide.flow.vote'),
      ],
    },
    {
      title: t('setup.guide.tips.title'),
      items: [
        t('setup.guide.tips.citizen'),
        t('setup.guide.tips.liar'),
        t('setup.guide.tips.group'),
      ],
    },
    {
      title: t('setup.guide.settings.title'),
      items: [
        t('setup.guide.settings.liars'),
        t('setup.guide.settings.timer'),
        t('setup.guide.settings.hint'),
      ],
    },
  ];

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

      <GuideDialog
        open={guideOpen}
        title={t('setup.guide.title')}
        intro={t('setup.guide.intro')}
        sections={guideSections}
        closeLabel={t('setup.guide.close')}
        onClose={() => setGuideOpen(false)}
      />

      <PlayerCountControl
        value={config.playerCount}
        min={MIN_PLAYERS}
        max={MAX_PLAYERS}
        presets={PLAYER_PRESETS}
        label={t('setup.playerCount.label')}
        help={t('setup.playerCount.help')}
        valueLabel={t('setup.playerCount.value', { count: config.playerCount })}
        decreaseLabel={t('setup.playerCount.decrease')}
        increaseLabel={t('setup.playerCount.increase')}
        presetLabel={value => t('setup.playerCount.preset', { count: value })}
        onChange={setPlayerCount}
      />

      <PlayerNamesEditor
        playerCount={config.playerCount}
        playerNames={config.playerNames}
        label={t('setup.playerNames.label')}
        summary={t('setup.playerNames.summary')}
        help={t('setup.playerNames.help')}
        placeholderLabel={num => t('setup.playerNames.placeholder', { num })}
        clearLabel={t('setup.playerNames.clear')}
        onChange={changePlayerName}
        onClear={clearPlayerNames}
      />

      <div className="setup-actions">
        <button className="primary-btn wide" type="button" onClick={startGame}>{t('setup.quickStart')}</button>
        <div className="setup-secondary-actions">
          <button className="ghost-btn compact" type="button" onClick={() => setGuideOpen(true)}>
            {t('setup.guide.open')}
          </button>
          <button className="ghost-btn compact" type="button" onClick={() => dispatch({ type: 'GO', phase: 'history' })}>{t('setup.history')}</button>
        </div>
      </div>

      <details className="field advanced-box">
        <summary>
          <span>{t('setup.advanced.label')}</span>
          <small>{advancedSummary}</small>
        </summary>
        <div className="advanced-content">
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

          <div className="field category-picker">
            <span>{config.categories.length ? t('setup.categories.summarySelected', { count: config.categories.length }) : t('setup.categories.summaryAll')}</span>
            <p className="field-help">{t('setup.categories.help')}</p>
            <div className="cat-grid">
              {CATEGORIES.map(category => (
                <button key={category} className={config.categories.includes(category) ? 'on' : ''} type="button" onClick={() => toggleCategory(category)}>
                  {categoryLabel(category)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
