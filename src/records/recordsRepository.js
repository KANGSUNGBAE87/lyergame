import { localRecords } from './localRecords.js';

export let recordsRepository = localRecords;

export function setRecordsRepository(repository) {
  recordsRepository = repository;
}
