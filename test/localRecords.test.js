import { beforeEach, describe, expect, it } from 'vitest';
import { localRecords } from '../src/records/localRecords.js';

beforeEach(() => localStorage.clear());

describe('localRecords', () => {
  it('starts with an empty list', async () => {
    await expect(localRecords.listGames()).resolves.toEqual([]);
  });

  it('saves games newest first', async () => {
    await localRecords.saveGame({ date: 1, winnerIndices: [0] });
    await localRecords.saveGame({ date: 2, winnerIndices: [1] });
    const games = await localRecords.listGames();
    expect(games).toHaveLength(2);
    expect(games[0].date).toBe(2);
  });

  it('keeps only the latest 50 games', async () => {
    for (let i = 0; i < 55; i++) {
      await localRecords.saveGame({ date: i });
    }
    const games = await localRecords.listGames();
    expect(games).toHaveLength(50);
    expect(games[0].date).toBe(54);
    expect(games.at(-1).date).toBe(5);
  });
});
