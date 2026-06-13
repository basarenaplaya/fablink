import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { ProviderProfile } from '@/types';

const PROVIDERS_COLLECTION = 'providers';

export async function listProviders(): Promise<ProviderProfile[]> {
  const snapshot = await getDocs(collection(db, PROVIDERS_COLLECTION));

  return snapshot.docs
    .map((document) => document.data() as ProviderProfile)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
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
