import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { ProviderProfile } from '@/types';

const PROVIDERS_COLLECTION = 'providers';

export class ProviderServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderServiceError';
  }
}

export async function listProviders(): Promise<ProviderProfile[]> {
  const snapshot = await getDocs(collection(db, PROVIDERS_COLLECTION));

  return snapshot.docs
    .map((document) => document.data() as ProviderProfile)
    .sort((left, right) => {
      if (left.verified !== right.verified) {
        return left.verified ? -1 : 1;
      }

      const leftRating = left.ratingAverage ?? 0;
      const rightRating = right.ratingAverage ?? 0;
      if (leftRating !== rightRating) {
        return rightRating - leftRating;
      }

      return right.createdAt.localeCompare(left.createdAt);
    });
}

export async function getProviderById(
  id: string,
): Promise<ProviderProfile | null> {
  const snapshot = await getDoc(doc(db, PROVIDERS_COLLECTION, id));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as ProviderProfile;
}

export async function getProviderByUserId(
  uid: string,
): Promise<ProviderProfile | null> {
  return getProviderById(uid);
}

export async function createProviderProfile(
  profile: ProviderProfile,
): Promise<ProviderProfile> {
  await setDoc(doc(db, PROVIDERS_COLLECTION, profile.id), profile);
  return profile;
}

export async function updateProviderProfile(
  profile: ProviderProfile,
  callerUid: string,
): Promise<ProviderProfile> {
  if (profile.id !== callerUid) {
    throw new ProviderServiceError('Non autorisé');
  }

  const existing = await getProviderById(profile.id);

  if (!existing) {
    throw new ProviderServiceError('Atelier introuvable');
  }

  const updated: Omit<ProviderProfile, 'id'> & { updatedAt: string } = {
    name: profile.name,
    category: profile.category,
    city: profile.city,
    description: profile.description,
    whatsapp: profile.whatsapp,
    images: profile.images,
    verified: existing.verified,
    ratingAverage: existing.ratingAverage,
    ratingCount: existing.ratingCount,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(doc(db, PROVIDERS_COLLECTION, profile.id), updated);

  return { id: profile.id, ...updated };
}
