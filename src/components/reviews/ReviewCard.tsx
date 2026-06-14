import { StarRating } from '@/components/reviews/StarRating';
import type { ProviderReview } from '@/types';

interface ReviewCardProps {
  review: ProviderReview;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-TN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/80 text-sm font-medium text-zinc-200"
        aria-hidden="true"
      >
        {getInitials(review.clientName)}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium text-zinc-50">{review.clientName}</p>
          <time
            className="text-xs text-zinc-500"
            dateTime={review.updatedAt ?? review.createdAt}
          >
            {formatReviewDate(review.updatedAt ?? review.createdAt)}
          </time>
        </div>

        <StarRating value={review.rating} size="sm" />

        <p className="text-sm leading-relaxed text-zinc-300">{review.comment}</p>
      </div>
    </article>
  );
}
