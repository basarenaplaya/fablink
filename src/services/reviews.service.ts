import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import {
  reviewInputSchema,
  type ReviewInput,
} from '@/lib/validation/review';
import type { ProviderReview } from '@/types';

const PROVIDERS_COLLECTION = 'providers';
const REVIEWS_SUBCOLLECTION = 'reviews';

export class ReviewServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReviewServiceError';
  }
}

function reviewsCollection(providerId: string) {
  return collection(
    db,
    PROVIDERS_COLLECTION,
    providerId,
    REVIEWS_SUBCOLLECTION,
  );
}

function reviewDocRef(providerId: string, clientId: string) {
  return doc(db, PROVIDERS_COLLECTION, providerId, REVIEWS_SUBCOLLECTION, clientId);
}

function providerDocRef(providerId: string) {
  return doc(db, PROVIDERS_COLLECTION, providerId);
}

function mapReviewDocument(
  id: string,
  data: Omit<ProviderReview, 'id'>,
): ProviderReview {
  return { id, ...data };
}

function roundRatingAverage(value: number): number {
  return Math.round(value * 10) / 10;
}

export async function listProviderReviews(
  providerId: string,
): Promise<ProviderReview[]> {
  const snapshot = await getDocs(reviewsCollection(providerId));

  return snapshot.docs
    .map((document) =>
      mapReviewDocument(
        document.id,
        document.data() as Omit<ProviderReview, 'id'>,
      ),
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getUserReviewForProvider(
  providerId: string,
  clientId: string,
): Promise<ProviderReview | null> {
  const snapshot = await getDoc(reviewDocRef(providerId, clientId));

  if (!snapshot.exists()) {
    return null;
  }

  return mapReviewDocument(
    snapshot.id,
    snapshot.data() as Omit<ProviderReview, 'id'>,
  );
}

export interface UpsertProviderReviewInput {
  providerId: string;
  clientId: string;
  clientName: string;
  rating: ReviewInput['rating'];
  comment: string;
}

export async function upsertProviderReview(
  input: UpsertProviderReviewInput,
): Promise<ProviderReview> {
  if (input.clientId === input.providerId) {
    throw new ReviewServiceError('Vous ne pouvez pas évaluer votre propre atelier');
  }

  const parsed = reviewInputSchema.safeParse({
    rating: input.rating,
    comment: input.comment,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message;
    throw new ReviewServiceError(
      firstIssue ?? 'Données d\'avis invalides',
    );
  }

  const now = new Date().toISOString();
  const reviewRef = reviewDocRef(input.providerId, input.clientId);
  const providerRef = providerDocRef(input.providerId);

  return runTransaction(db, async (transaction) => {
    const providerSnapshot = await transaction.get(providerRef);

    if (!providerSnapshot.exists()) {
      throw new ReviewServiceError('Atelier introuvable');
    }

    const existingReviewSnapshot = await transaction.get(reviewRef);
    const existingReview = existingReviewSnapshot.exists()
      ? (existingReviewSnapshot.data() as Omit<ProviderReview, 'id'>)
      : null;

    const providerData = providerSnapshot.data();
    const currentCount = providerData.ratingCount ?? 0;
    const currentAverage = providerData.ratingAverage ?? 0;

    let newCount = currentCount;
    let newAverage = currentAverage;

    if (existingReview) {
      newAverage = roundRatingAverage(
        (currentAverage * currentCount -
          existingReview.rating +
          parsed.data.rating) /
          currentCount,
      );
    } else {
      newCount = currentCount + 1;
      newAverage = roundRatingAverage(
        (currentAverage * currentCount + parsed.data.rating) / newCount,
      );
    }

    const reviewPayload: ProviderReview = {
      id: input.clientId,
      providerId: input.providerId,
      clientId: input.clientId,
      clientName: input.clientName.trim(),
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      createdAt: existingReview?.createdAt ?? now,
      updatedAt: now,
    };

    transaction.set(reviewRef, reviewPayload);
    transaction.set(
      providerRef,
      {
        ratingCount: newCount,
        ratingAverage: newAverage,
      },
      { merge: true },
    );

    return reviewPayload;
  });
}
