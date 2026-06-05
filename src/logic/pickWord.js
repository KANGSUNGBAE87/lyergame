import { CATEGORIES, WORDS } from '../data/words.js';

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function pickWord(options = {}) {
  const requestedCategories = options.categories?.length ? options.categories : CATEGORIES;
  const validCategories = requestedCategories.filter(item => WORDS[item]?.length);
  const categories = validCategories.length ? validCategories : CATEGORIES;
  const category = randomItem(categories);
  const allWords = WORDS[category];
  const difficulty = Number(options.difficulty || 0);
  let pool = [1, 2, 3].includes(difficulty)
    ? allWords.filter(item => item.d === difficulty)
    : allWords;

  if (pool.length === 0) {
    pool = allWords;
  }

  const chosen = randomItem(pool);
  return {
    category,
    word: chosen.w,
    difficulty: chosen.d,
  };
}
