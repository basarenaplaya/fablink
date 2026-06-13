'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { getProviderByUserId } from '@/services/providers.service';

function OnboardingSkeleton() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 backdrop-blur-md">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace('/login?redirect=/onboarding');
      return;
    }

    const uid = user.uid;

    async function checkExistingProvider() {
      const existing = await getProviderByUserId(uid);
      if (existing) {
        router.replace('/');
        return;
      }
      setCheckingProfile(false);
    }

    void checkExistingProvider();
  }, [loading, user, router]);

  if (loading || checkingProfile || !user) {
    return <OnboardingSkeleton />;
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950"
      />
      <main className="relative flex flex-1 flex-col items-center px-4 py-10">
        <OnboardingForm userId={user.uid} />
      </main>
    </div>
  );
}
