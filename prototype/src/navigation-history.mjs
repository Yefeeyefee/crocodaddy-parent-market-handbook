export function pushScreenTransition(history, beforeState, afterState, { direct = false, scrollTop = 0 } = {}) {
  if (direct || beforeState.screen === afterState.screen) return history;
  return [...history, { state: beforeState, scrollTop }];
}

export function popScreenTransition(history) {
  if (history.length === 0) return { history, entry: null };
  return { history: history.slice(0, -1), entry: history.at(-1) };
}
