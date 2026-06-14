import { StarRating } from '@/components/reviews/StarRating';
import { copy } from '@/lib/copy';
import { cn } from '@/lib/utils';

interface RatingSummaryProps {
  average?: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingSummary({
  average = 0,
  count = 0,
  size = 'md',
  className,
}: RatingSummaryProps) {
  if (!count || count <= 0) {
    return (
      <p
        className={cn(
          'text-zinc-500',
          size === 'sm' ? 'text-xs' : 'text-sm',
          className,
        )}
      >
        {copy.marketplace.noReviews}
      </p>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {size === 'lg' ? (
        <span className="text-3xl font-semibold tabular-nums text-zinc-50">
          {average.toFixed(1)}
        </span>
      ) : null}
      <StarRating value={average} size={size} />
      <span
        className={cn(
          'text-zinc-400',
          size === 'sm' ? 'text-xs' : 'text-sm',
        )}
      >
        {size !== 'lg' ? (
          <>
            <span className="font-medium text-zinc-300">
              {average.toFixed(1)}
            </span>{' '}
          </>
        ) : null}
        ({copy.reviews.count(count)})
      </span>
    </div>
  );
}
