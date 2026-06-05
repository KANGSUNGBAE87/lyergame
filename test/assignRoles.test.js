import { describe, expect, it } from 'vitest';
import { assignRoles } from '../src/logic/assignRoles.js';

describe('assignRoles', () => {
  it('assigns exactly the requested liar count', () => {
    expect(assignRoles(6, 2)).toHaveLength(2);
  });

  it('returns unique player indices within range', () => {
    const result = assignRoles(5, 2);
    expect(new Set(result).size).toBe(2);
    result.forEach(index => {
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(5);
    });
  });

  it('defaults to one liar', () => {
    expect(assignRoles(4)).toHaveLength(1);
  });

  it('limits liar count to player count minus one', () => {
    expect(assignRoles(3, 5)).toHaveLength(2);
  });
});
