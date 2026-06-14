'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  getUserReviewForProvider,
  listProviderReviews,
  upsertProviderReview,
  type UpsertProviderReviewInput,
} from '@/services/reviews.service';
import type { ProviderReview, ReviewRating } from '@/types';

interface UseProviderReviewsReturn {
  reviews: ProviderReview[];
  userReview: ProviderReview | null;
  loading: boolean;
  error: string | null;
  submitReview: (input: Omit<UpsertProviderReviewInput, 'providerId'>) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProviderReviews(
  providerId: string,
  clientId: string | undefined,
): UseProviderReviewsReturn {
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [userReview, setUserReview] = useState<ProviderReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!providerId) {
      setReviews([]);
      setUserReview(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [allReviews, existingUserReview] = await Promise.all([
        listProviderReviews(providerId),
        clientId
          ? getUserReviewForProvider(providerId, clientId)
          : Promise.resolve(null),
      ]);
      setReviews(allReviews);
      setUserReview(existingUserReview);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load reviews';
      setError(message);
      setReviews([]);
      setUserReview(null);
    } finally {
      setLoading(false);
    }
  }, [providerId, clientId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const submitReview = useCallback(
    async (input: Omit<UpsertProviderReviewInput, 'providerId'>) => {
      await upsertProviderReview({
        providerId,
        ...input,
      });
      await refresh();
    },
    [providerId, refresh],
  );

  return {
    reviews,
    userReview,
    loading,
    error,
    submitReview: async (input) => {
      await submitReview(input);
    },
    refresh,
  };
}

// Export a simpler submit signature for forms
export type SubmitReviewFn = (
  rating: ReviewRating,
  comment: string,
  clientId: string,
  clientName: string,
) => Promise<void>;
