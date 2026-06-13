import { addDoc, collection } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { ManufacturingCategory } from '@/types';

interface WhatsAppClickEvent {
  providerId: string;
  categories: ManufacturingCategory[];
  clientId?: string;
  createdAt: string;
}

const ANALYTICS_CLICKS_COLLECTION = 'analytics_clicks';

export async function trackWhatsAppClick(
  event: Omit<WhatsAppClickEvent, 'createdAt'>,
): Promise<void> {
  const payload: WhatsAppClickEvent = {
    ...event,
    createdAt: new Date().toISOString(),
  };

  await addDoc(collection(db, ANALYTICS_CLICKS_COLLECTION), payload);
}
