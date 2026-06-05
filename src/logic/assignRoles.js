export function assignRoles(playerCount, liarCount = 1) {
  const count = Math.min(Math.max(1, liarCount), playerCount - 1);
  const indices = Array.from({ length: playerCount }, (_, index) => index);

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices.slice(0, count).sort((a, b) => a - b);
}
