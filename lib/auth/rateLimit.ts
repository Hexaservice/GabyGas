type AttemptState = {
  attempts: number;
  blockedUntil: number;
  lastAttemptAt: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 15 * 60 * 1000;

const attemptStore = new Map<string, AttemptState>();

function cleanup(now: number) {
  for (const [key, state] of attemptStore.entries()) {
    const isExpired = now - state.lastAttemptAt > WINDOW_MS && state.blockedUntil < now;

    if (isExpired) {
      attemptStore.delete(key);
    }
  }
}

export function registerFailedLogin(key: string): { blocked: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  cleanup(now);

  const current = attemptStore.get(key);

  if (!current) {
    attemptStore.set(key, {
      attempts: 1,
      blockedUntil: 0,
      lastAttemptAt: now,
    });

    return { blocked: false, retryAfterSeconds: 0 };
  }

  if (current.blockedUntil > now) {
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil((current.blockedUntil - now) / 1000),
    };
  }

  const withinWindow = now - current.lastAttemptAt <= WINDOW_MS;
  const nextAttempts = withinWindow ? current.attempts + 1 : 1;
  const blockedUntil = nextAttempts >= MAX_ATTEMPTS ? now + BLOCK_MS : 0;

  attemptStore.set(key, {
    attempts: nextAttempts,
    blockedUntil,
    lastAttemptAt: now,
  });

  return {
    blocked: blockedUntil > now,
    retryAfterSeconds: blockedUntil > now ? Math.ceil((blockedUntil - now) / 1000) : 0,
  };
}

export function clearLoginAttempts(key: string) {
  attemptStore.delete(key);
}

export function isLoginBlocked(key: string): { blocked: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const current = attemptStore.get(key);

  if (!current || current.blockedUntil <= now) {
    return { blocked: false, retryAfterSeconds: 0 };
  }

  return {
    blocked: true,
    retryAfterSeconds: Math.ceil((current.blockedUntil - now) / 1000),
  };
}
