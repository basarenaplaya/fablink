'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { copy } from '@/lib/copy';
import { RequestForm } from '@/components/requests/RequestForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

function NewRequestSkeleton() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 backdrop-blur-md">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    </div>
  );
}

export default function NewRequestPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace('/signup/client?redirect=/requests/new');
      return;
    }

    if (profile?.role === 'provider') {
      toast.info(copy.redirects.providerToJobBoard);
      router.replace('/requests');
    }
  }, [loading, user, profile, router]);

  if (loading || !user || !profile) {
    return <NewRequestSkeleton />;
  }

  if (profile.role === 'provider') {
    return <NewRequestSkeleton />;
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950"
      />
      <main className="relative flex flex-1 flex-col items-center px-4 py-10">
        <RequestForm
          userId={user.uid}
          clientName={profile.name}
          profile={profile}
        />
      </main>
    </div>
  );
}
