'use client';

import { CategoryFilter } from '@/components/marketplace/CategoryFilter';
import { CityFilter } from '@/components/marketplace/CityFilter';
import { JobBoardCard } from '@/components/requests/JobBoardCard';
import { Skeleton } from '@/components/ui/skeleton';
import { copy } from '@/lib/copy';
import type { ServiceRequest } from '@/types';
import type { RequestFilters } from '@/hooks/useRequests';

interface RequestBoardProps {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
  filters: RequestFilters;
  onCategoryChange: (category: RequestFilters['category']) => void;
  onCityChange: (city: RequestFilters['city']) => void;
}

function RequestBoardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-56 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function RequestBoard({
  requests,
  loading,
  error,
  filters,
  onCategoryChange,
  onCityChange,
}: RequestBoardProps) {
  return (
    <div className="flex flex-col gap-8">
      <section className="sticky top-14 z-10 -mx-4 border-y border-zinc-800/80 bg-zinc-950/80 px-4 py-4 backdrop-blur-md">
        <div className="flex flex-col gap-4">
          <CategoryFilter value={filters.category} onChange={onCategoryChange} />
          <CityFilter value={filters.city} onChange={onCityChange} />
        </div>
      </section>

      {loading ? <RequestBoardSkeleton /> : null}

      {!loading && error ? (
        <p className="text-center text-sm text-red-400">{error}</p>
      ) : null}

      {!loading && !error && requests.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-lg font-medium text-zinc-300">{copy.requests.board.empty}</p>
          <p className="max-w-sm text-sm text-zinc-500">
            {copy.requests.board.emptyHint}
          </p>
        </div>
      ) : null}

      {!loading && !error && requests.length > 0 ? (
        <div className="flex flex-col gap-4">
          {requests.map((request) => (
            <JobBoardCard key={request.id} request={request} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
