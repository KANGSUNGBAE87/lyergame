export function getPeekPostRevealStep({ revealed = [], index }) {
  const nextRevealed = revealed.map((used, playerIndex) => (playerIndex === index ? true : used));
  return nextRevealed.every(Boolean) ? 'discussion' : 'next-card';
}

export function getPeekInstructionKey({ done = 0 } = {}) {
  return done > 0 ? 'peek.currentAfterFirst' : 'peek.current';
}
