import * as storage from '../core/storage.js';

const KEY = 'records';
const MAX_RECORDS = 50;

export const localRecords = {
  async saveGame(record) {
    const records = storage.getJSON(KEY, []);
    records.unshift(record);
    storage.setJSON(KEY, records.slice(0, MAX_RECORDS));
  },

  async listGames() {
    return storage.getJSON(KEY, []);
  },
};
