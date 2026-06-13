import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { UserProfile, UserRole } from '@/types';

const USERS_COLLECTION = 'users';

export async function getUserProfile(
  uid: string,
): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

export async function createUserProfile(
  profile: UserProfile,
): Promise<UserProfile> {
  await setDoc(doc(db, USERS_COLLECTION, profile.id), profile);
  return profile;
}

export async function updateUserRole(
  uid: string,
  role: UserRole,
): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, uid), { role });
}
