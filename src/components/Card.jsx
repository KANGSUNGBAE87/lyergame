import { useI18n } from '../i18n/I18nProvider.jsx';

export default function Card({ idx, used, label, onClick }) {
  const { t } = useI18n();
  const num = idx + 1;
  const visibleLabel = label ?? t('common.playerNumber', { num });

  return (
    <button
      className={'card' + (used ? ' used' : '')}
      type="button"
      disabled={used}
      onClick={onClick}
      aria-label={t('card.aria', { num })}
    >
      <span className="card-mark">?</span>
      <span className="card-num">{visibleLabel}</span>
    </button>
  );
}
