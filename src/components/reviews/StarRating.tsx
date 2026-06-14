'use client';

import { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { ReviewRating } from '@/types';

interface StarRatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: ReviewRating) => void;
  className?: string;
}

const sizeClasses = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
};

export function StarRating({
  value,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      onMouseLeave={() => interactive && setHoverValue(null)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Sélectionner une note' : `Note : ${value} sur ${max}`}
    >
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= displayValue;

        if (interactive && onChange) {
          return (
            <button
              key={starValue}
              type="button"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-md transition-transform active:scale-95"
              onMouseEnter={() => setHoverValue(starValue)}
              onClick={() => onChange(starValue as ReviewRating)}
              aria-label={`${starValue} étoile${starValue > 1 ? 's' : ''}`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-zinc-600',
                )}
              />
            </button>
          );
        }

        return (
          <Star
            key={starValue}
            className={cn(
              sizeClasses[size],
              filled ? 'fill-amber-400 text-amber-400' : 'text-zinc-600',
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
