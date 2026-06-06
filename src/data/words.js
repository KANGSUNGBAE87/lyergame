import { WORD_LIST } from './wordList.js';
import { normalizeLocale } from '../i18n/messages.js';

export const WORDS = WORD_LIST;
export const CATEGORIES = Object.keys(WORDS);
export const WORD_COUNT = Object.values(WORDS).reduce((sum, words) => sum + words.length, 0);

export function getWordText(word, locale = 'ko') {
  const normalized = normalizeLocale(locale);
  return word[normalized] ?? word.ko;
}
