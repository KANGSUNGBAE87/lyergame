import { useI18n } from '../i18n/I18nProvider.jsx';

export default function Scoreboard({ scores, delta = [], liarIndices = [] }) {
  const { t } = useI18n();
  const ranked = scores
    .map((score, index) => ({ score, index, delta: delta[index] || 0 }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return (
    <div className="scoreboard">
      {ranked.map(({ score, index, delta: change }) => (
        <div className="sb-row" key={index}>
          <span className="sb-name">{t('common.playerNumber', { num: index + 1 })}{liarIndices.includes(index) ? t('scoreboard.liarSuffix') : ''}</span>
          <span className="sb-score">
            {score}
            {change ? <em className="sb-delta">+{change}</em> : null}
          </span>
        </div>
      ))}
    </div>
  );
}
