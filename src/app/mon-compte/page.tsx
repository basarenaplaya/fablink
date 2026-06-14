'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AccountHub } from '@/components/account/AccountHub';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

function AccountSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export default function MonComptePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace('/signup/client?redirect=/mon-compte');
    }
  }, [loading, user, router]);

  if (loading || !user || !profile) {
    return (
      <div className="relative flex flex-1 flex-col">
        <AccountSkeleton />
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950"
      />
      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8">
        <AccountHub profile={profile} />
      </main>
    </div>
  );
}
