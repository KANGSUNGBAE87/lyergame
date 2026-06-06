import { useI18n } from '../i18n/I18nProvider.jsx';
import { playerLabel } from '../logic/players.js';

export default function Scoreboard({ scores, delta = [], liarIndices = [], playerNames = [] }) {
  const { t } = useI18n();
  const ranked = scores
    .map((score, index) => ({ score, index, delta: delta[index] || 0 }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return (
    <div className="scoreboard">
      {ranked.map(({ score, index, delta: change }) => (
        <div className="sb-row" key={index}>
          <span className="sb-name">{playerLabel(index, playerNames)}{liarIndices.includes(index) ? t('scoreboard.liarSuffix') : ''}</span>
          <span className="sb-score">
            {score}
            {change ? <em className="sb-delta">+{change}</em> : null}
          </span>
        </div>
      ))}
    </div>
  );
}
