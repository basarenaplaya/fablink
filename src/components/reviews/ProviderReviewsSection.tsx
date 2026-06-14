'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';
import { RatingSummary } from '@/components/reviews/RatingSummary';
import { Button } from '@/components/ui/button';
import { copy } from '@/lib/copy';
import { useAuth } from '@/hooks/useAuth';
import {
  getUserReviewForProvider,
  listProviderReviews,
  upsertProviderReview,
} from '@/services/reviews.service';
import type { ProviderProfile, ProviderReview, ReviewRating } from '@/types';

interface ProviderReviewsSectionProps {
  provider: ProviderProfile;
  onReviewSubmitted?: () => void;
}

export function ProviderReviewsSection({
  provider,
  onReviewSubmitted,
}: ProviderReviewsSectionProps) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [userReview, setUserReview] = useState<ProviderReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwner = user?.uid === provider.id;
  const canReview = Boolean(user && profile && !isOwner);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [allReviews, existingUserReview] = await Promise.all([
        listProviderReviews(provider.id),
        user
          ? getUserReviewForProvider(provider.id, user.uid)
          : Promise.resolve(null),
      ]);
      setReviews(allReviews);
      setUserReview(existingUserReview);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : copy.reviews.toasts.loadError;
      setError(message);
      setReviews([]);
      setUserReview(null);
    } finally {
      setLoading(false);
    }
  }, [provider.id, user]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  async function handleSubmit(rating: ReviewRating, comment: string) {
    if (!user || !profile) {
      throw new Error('Vous devez être connecté pour laisser un avis');
    }

    await upsertProviderReview({
      providerId: provider.id,
      clientId: user.uid,
      clientName: profile.name,
      rating,
      comment,
    });

    await loadReviews();
    onReviewSubmitted?.();
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5 text-zinc-400" />
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
            {copy.reviews.title}
          </h2>
        </div>
        <p className="text-sm text-zinc-400">{copy.reviews.subtitle}</p>
        <RatingSummary
          average={provider.ratingAverage}
          count={provider.ratingCount}
          size="lg"
        />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {!user && !isOwner ? (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
          <p className="text-sm text-zinc-400">{copy.reviews.form.signInCta}</p>
          <Button asChild className="min-h-11 active:scale-95">
            <Link href={`/signup/client?redirect=/providers/${provider.id}`}>
              {copy.reviews.form.signIn}
            </Link>
          </Button>
        </div>
      ) : null}

      {canReview ? (
        <ReviewForm userReview={userReview} onSubmit={handleSubmit} />
      ) : null}

      <ReviewList reviews={reviews} loading={loading} />
    </section>
  );
}
