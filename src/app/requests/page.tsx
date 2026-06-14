'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { copy } from '@/lib/copy';
import { JobBoardHero } from '@/components/requests/JobBoardHero';
import { RequestBoard } from '@/components/requests/RequestBoard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useRequests } from '@/hooks/useRequests';

function JobBoardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

export default function RequestsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const {
    filteredRequests,
    loading: requestsLoading,
    error,
    filters,
    setCategory,
    setCity,
  } = useRequests();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace('/signup/client?redirect=/requests');
      return;
    }

    if (profile?.role === 'client') {
      toast.info(copy.redirects.clientToNewRequest);
      router.replace('/requests/new');
    }
  }, [authLoading, user, profile, router]);

  if (authLoading || !user || !profile) {
    return <JobBoardSkeleton />;
  }

  if (profile.role === 'client') {
    return <JobBoardSkeleton />;
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950"
      />
      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
        <JobBoardHero />

        <RequestBoard
          requests={filteredRequests}
          loading={requestsLoading}
          error={error}
          filters={filters}
          onCategoryChange={setCategory}
          onCityChange={setCity}
        />
      </main>
    </div>
  );
}
