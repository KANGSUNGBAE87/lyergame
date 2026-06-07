import { describe, expect, it } from 'vitest';
import { getPeekInstructionKey, getPeekPostRevealStep } from '../src/logic/peekFlow.js';

describe('peek flow', () => {
  it('moves directly to the next card instead of a pass-phone screen after a reveal', () => {
    expect(getPeekPostRevealStep({
      revealed: [false, false, false],
      index: 0,
    })).toBe('next-card');
  });

  it('moves to discussion after the last player checks their card', () => {
    expect(getPeekPostRevealStep({
      revealed: [true, true, false],
      index: 2,
    })).toBe('discussion');
  });

  it('uses a pass instruction once at least one player has checked', () => {
    expect(getPeekInstructionKey({ done: 0 })).toBe('peek.current');
    expect(getPeekInstructionKey({ done: 1 })).toBe('peek.currentAfterFirst');
  });
});
