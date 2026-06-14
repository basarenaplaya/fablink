'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { StarRating } from '@/components/reviews/StarRating';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { copy } from '@/lib/copy';
import type { ProviderReview, ReviewRating } from '@/types';

interface ReviewFormProps {
  userReview: ProviderReview | null;
  onSubmit: (rating: ReviewRating, comment: string) => Promise<void>;
}

export function ReviewForm({ userReview, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState<ReviewRating | null>(
    userReview?.rating ?? null,
  );
  const [comment, setComment] = useState(userReview?.comment ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!rating) {
      setError('Sélectionnez une note');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(rating, comment);
      toast.success(
        userReview
          ? copy.reviews.toasts.updated
          : copy.reviews.toasts.published,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : copy.reviews.toasts.error;
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg text-zinc-50">
          {userReview
            ? copy.reviews.form.editTitle
            : copy.reviews.form.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-5">
          <Field data-invalid={!!error && !rating}>
            <FieldLabel>{copy.reviews.form.rating}</FieldLabel>
            <StarRating
              value={rating ?? 0}
              interactive
              size="lg"
              onChange={setRating}
            />
            {!rating && error ? <FieldError>{error}</FieldError> : null}
          </Field>

          <Field>
            <FieldLabel htmlFor="review-comment">
              {copy.reviews.form.comment}
            </FieldLabel>
            <Textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder={copy.reviews.form.commentPlaceholder}
              className="border-zinc-800 bg-zinc-900/70"
            />
          </Field>

          <Button
            type="submit"
            disabled={submitting}
            className="min-h-11 w-full active:scale-95 sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {copy.reviews.form.submitting}
              </>
            ) : userReview ? (
              copy.reviews.form.update
            ) : (
              copy.reviews.form.submit
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
