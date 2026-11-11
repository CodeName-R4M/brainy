// Per-user practice stats.
// A brand new account starts at zero; values grow only from real practice sessions.
const KEY = (userId) => `abakids:stats:${userId || 'guest'}`;

const EMPTY = {
  points: 0,
  bestScore: 0,
  sessions: 0,
  streak: 0,
  lastPlayed: null,
  totalAnswered: 0,
  totalCorrect: 0
};

const dayKey = (date = new Date()) => date.toLocaleDateString('en-CA'); // yyyy-mm-dd (local)

export function loadStats(userId) {
  try {
    const raw = localStorage.getItem(KEY(userId));
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY };
  }
}

export function accuracyOf(stats) {
  if (!stats.totalAnswered) return null;
  return Math.round((stats.totalCorrect / stats.totalAnswered) * 100);
}

export function recordSession(userId, { score = 0, correct = 0, total = 0 }) {
  const stats = loadStats(userId);
  const today = dayKey();

  let streak = stats.streak;
  if (stats.lastPlayed !== today) {
    const yesterday = dayKey(new Date(Date.now() - 86400000));
    streak = stats.lastPlayed === yesterday ? stats.streak + 1 : 1;
  }

  const next = {
    ...stats,
    points: stats.points + score,
    bestScore: Math.max(stats.bestScore, score),
    sessions: stats.sessions + 1,
    streak,
    lastPlayed: today,
    totalAnswered: stats.totalAnswered + total,
    totalCorrect: stats.totalCorrect + correct
  };

  try {
    localStorage.setItem(KEY(userId), JSON.stringify(next));
  } catch {
    // Storage unavailable — stats simply won't persist.
  }
  return next;
}
