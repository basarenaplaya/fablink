import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { isValidWhatsapp, sanitizeWhatsapp } from '@/lib/whatsapp';
import type { UserProfile, UserRole } from '@/types';

const USERS_COLLECTION = 'users';

export class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}

export interface UpdateUserProfileInput {
  name?: string;
  whatsapp?: string;
}

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

export async function updateUserProfile(
  uid: string,
  updates: UpdateUserProfileInput,
): Promise<UserProfile> {
  const existing = await getUserProfile(uid);

  if (!existing) {
    throw new UserServiceError('Profil introuvable');
  }

  const payload: Partial<UserProfile> = {
    updatedAt: new Date().toISOString(),
  };

  if (updates.name !== undefined) {
    const trimmed = updates.name.trim();
    if (trimmed.length < 2) {
      throw new UserServiceError('Le nom doit contenir au moins 2 caractères');
    }
    payload.name = trimmed;
  }

  if (updates.whatsapp !== undefined) {
    const sanitized = sanitizeWhatsapp(updates.whatsapp);
    if (!isValidWhatsapp(sanitized)) {
      throw new UserServiceError('Format 216XXXXXXXX requis');
    }
    payload.whatsapp = sanitized;
  }

  await updateDoc(doc(db, USERS_COLLECTION, uid), payload);

  return { ...existing, ...payload };
}

export async function updateUserRole(
  uid: string,
  role: UserRole,
): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    role,
    updatedAt: new Date().toISOString(),
  });
}
