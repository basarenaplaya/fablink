import { copy } from '@/lib/copy';

interface FirebaseAuthErrorLike {
  code?: string;
  message?: string;
}

const AUTH_ERROR_MAP: Record<string, string> = {
  'auth/unauthorized-domain': copy.auth.errors.unauthorizedDomain,
  'auth/popup-closed-by-user': copy.auth.errors.popupClosed,
  'auth/cancelled-popup-request': copy.auth.errors.popupCancelled,
  'auth/popup-blocked': copy.auth.errors.popupBlocked,
  'auth/network-request-failed': copy.auth.errors.network,
  'auth/too-many-requests': copy.auth.errors.tooManyRequests,
  'auth/account-exists-with-different-credential':
    copy.auth.errors.accountExists,
};

export function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const authError = error as FirebaseAuthErrorLike;
    if (authError.code && AUTH_ERROR_MAP[authError.code]) {
      return AUTH_ERROR_MAP[authError.code];
    }
  }

  if (error instanceof Error && error.message) {
    const codeMatch = /\(auth\/[^)]+\)/.exec(error.message);
    if (codeMatch) {
      const code = codeMatch[0].slice(1, -1);
      if (AUTH_ERROR_MAP[code]) {
        return AUTH_ERROR_MAP[code];
      }
    }
  }

  return copy.auth.errors.default;
}
