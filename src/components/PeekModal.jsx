import React from 'react';
import { useI18n } from '../i18n/I18nProvider.jsx';
import LiarMascot from './LiarMascot.jsx';

export default function PeekModal({ active, isLiar, category, word, liarHint }) {
  const { t, categoryLabel } = useI18n();
  const translatedCategory = categoryLabel(category);

  if (!active) {
    return null;
  }

  return (
    <div className="peek-modal active">
      <div className="peek-card">
        {isLiar ? (
          <>
            <LiarMascot />
            <div className="pc-liar-label">{t('peekModal.liar')}</div>
            {liarHint ? <div className="pc-category">{t('peekModal.category', { category: translatedCategory })}</div> : null}
          </>
        ) : (
          <>
            <div className="pc-category">{translatedCategory}</div>
            <div className="pc-word">{word}</div>
          </>
        )}
      </div>
    </div>
  );
}
