export function numberLabel(index) {
  return `${index + 1}번`;
}

export function normalizePlayerName(name) {
  return String(name ?? '').trim();
}

export function buildPlayerNames(existingNames = [], playerCount = 0) {
  const length = Math.max(existingNames.length, playerCount);
  return Array.from({ length }, (_, index) => normalizePlayerName(existingNames[index]));
}

export function setPlayerName(existingNames = [], index, name) {
  const names = buildPlayerNames(existingNames, index + 1);
  names[index] = normalizePlayerName(name);
  return names;
}

export function playerLabel(index, playerNames = []) {
  const name = normalizePlayerName(playerNames[index]);
  return name || numberLabel(index);
}

export function playerNameWithNumber(index, playerNames = []) {
  const name = normalizePlayerName(playerNames[index]);
  return name ? `${name}(${numberLabel(index)})` : numberLabel(index);
}
