import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as storage from '../core/storage.js';
import { DEFAULT_LOCALE, normalizeLocale, translate } from './messages.js';

const STORAGE_KEY = 'locale';
const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => normalizeLocale(storage.get(STORAGE_KEY, DEFAULT_LOCALE)));

  const setLocale = useCallback(nextLocale => {
    const normalized = normalizeLocale(nextLocale);
    storage.set(STORAGE_KEY, normalized);
    setLocaleState(normalized);
  }, []);

  const t = useCallback((key, values) => translate(locale, key, values), [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    categoryLabel: category => t(`category.${category}`),
  }), [locale, setLocale, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
}
