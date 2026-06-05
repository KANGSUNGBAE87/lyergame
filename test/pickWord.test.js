import { describe, expect, it } from 'vitest';
import { CATEGORIES, WORD_COUNT, WORDS } from '../src/data/words.js';
import { pickWord } from '../src/logic/pickWord.js';

describe('word data', () => {
  it('keeps all legacy words across 20 categories', () => {
    expect(CATEGORIES).toHaveLength(20);
    expect(WORD_COUNT).toBe(853);
    expect(Object.values(WORDS).every(words => words.every(item => item.w && [1, 2, 3].includes(item.d)))).toBe(true);
  });
});

describe('pickWord', () => {
  it('returns a random category word when categories are omitted', () => {
    const result = pickWord({});
    expect(CATEGORIES).toContain(result.category);
    expect(typeof result.word).toBe('string');
    expect(result.word.length).toBeGreaterThan(0);
  });

  it('only picks from selected categories', () => {
    const result = pickWord({ categories: ['음식'] });
    expect(result.category).toBe('음식');
  });

  it('only picks the requested difficulty when available', () => {
    for (let i = 0; i < 30; i++) {
      const result = pickWord({ categories: ['음식'], difficulty: 1 });
      expect(result.difficulty).toBe(1);
    }
  });

  it('difficulty 0 allows every difficulty', () => {
    const result = pickWord({ difficulty: 0 });
    expect([1, 2, 3]).toContain(result.difficulty);
  });

  it('falls back to all words when filters produce an empty pool', () => {
    const result = pickWord({ categories: ['음식'], difficulty: 99 });
    expect(result.word).toBeTruthy();
    expect(result.category).toBe('음식');
  });

  it('falls back to known categories when selected categories are invalid', () => {
    const result = pickWord({ categories: ['없는카테고리'] });
    expect(CATEGORIES).toContain(result.category);
    expect(result.word).toBeTruthy();
  });
});
