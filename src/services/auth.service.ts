import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
  type Unsubscribe,
} from 'firebase/auth';

import { auth } from '@/lib/firebase';
import type { UserProfile } from '@/types';

import { createUserProfile, getUserProfile } from './users.service';

async function ensureUserProfile(firebaseUser: User): Promise<UserProfile> {
  const existingProfile = await getUserProfile(firebaseUser.uid);

  if (existingProfile) {
    return existingProfile;
  }

  const profile: UserProfile = {
    id: firebaseUser.uid,
    name: firebaseUser.displayName ?? 'User',
    email: firebaseUser.email ?? '',
    role: 'client',
    createdAt: new Date().toISOString(),
  };

  return createUserProfile(profile);
}

export function subscribeToAuthState(
  callback: (user: User | null) => void,
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle(): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return ensureUserProfile(result.user);
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export async function getCurrentUserIdToken(
  forceRefresh = false,
): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return null;
  }

  return currentUser.getIdToken(forceRefresh);
}

export async function resolveUserProfile(
  firebaseUser: User,
): Promise<UserProfile> {
  return ensureUserProfile(firebaseUser);
}
