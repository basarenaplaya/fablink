import { ReviewCard } from '@/components/reviews/ReviewCard';
import { Skeleton } from '@/components/ui/skeleton';
import { copy } from '@/lib/copy';
import type { ProviderReview } from '@/types';

interface ReviewListProps {
  reviews: ProviderReview[];
  loading: boolean;
}

function ReviewListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function ReviewList({ reviews, loading }: ReviewListProps) {
  if (loading) {
    return <ReviewListSkeleton />;
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 py-12 text-center">
        <p className="font-medium text-zinc-300">{copy.reviews.empty}</p>
        <p className="max-w-sm text-sm text-zinc-500">{copy.reviews.emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
