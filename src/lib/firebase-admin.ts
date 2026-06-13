import 'server-only';

import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth, type DecodedIdToken } from 'firebase-admin/auth';

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOrInitAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!privateKey) {
    throw new Error('Missing required environment variable: FIREBASE_PRIVATE_KEY');
  }

  const clientEmail = getRequiredEnv('FIREBASE_CLIENT_EMAIL');
  const projectId = getRequiredEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID');

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export const adminApp: App = getOrInitAdminApp();
export const adminAuth: Auth = getAuth(adminApp);

export function extractBearerToken(
  authorizationHeader: string | null,
): string | null {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
}

export async function verifyIdToken(token: string): Promise<DecodedIdToken> {
  return adminAuth.verifyIdToken(token);
}
