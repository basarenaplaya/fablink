import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

function buildFirebaseConfig(): FirebaseOptions {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (!apiKey) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_FIREBASE_API_KEY');
  }
  if (!authDomain) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    );
  }
  if (!projectId) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    );
  }
  if (!storageBucket) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    );
  }
  if (!messagingSenderId) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    );
  }
  if (!appId) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_FIREBASE_APP_ID');
  }

  const config: FirebaseOptions = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };

  if (measurementId) {
    config.measurementId = measurementId;
  }

  return config;
}

function getOrInitFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(buildFirebaseConfig());
}

export const firebaseApp: FirebaseApp = getOrInitFirebaseApp();
export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
