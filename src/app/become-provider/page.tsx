'use client';

import { useEffect, useState } from 'react';

import {
  BecomeProviderContent,
  BecomeProviderMarketingHeader,
} from '@/components/provider-funnel/BecomeProviderContent';
import { ProviderBenefits } from '@/components/provider-funnel/ProviderBenefits';
import {
  BecomeProviderClientLink,
  ProviderSignInGate,
} from '@/components/provider-funnel/ProviderSignInGate';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { getProviderByUserId } from '@/services/providers.service';
import type { ProviderProfile } from '@/types';

function BecomeProviderSkeleton() {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-6 px-4 py-10">
      <Skeleton className="h-10 w-64 self-center" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

export default function BecomeProviderPage() {
  const { user, loading } = useAuth();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      setProvider(null);
      setCheckingProfile(false);
      return;
    }

    const uid = user.uid;

    async function loadProvider() {
      const existing = await getProviderByUserId(uid);
      setProvider(existing);
      setCheckingProfile(false);
    }

    void loadProvider();
  }, [loading, user]);

  if (loading || (user && checkingProfile)) {
    return (
      <div className="relative flex flex-1 flex-col items-center">
        <BecomeProviderSkeleton />
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950"
      />
      <main className="relative flex flex-1 flex-col items-center px-4 py-10">
        {user ? (
          <BecomeProviderContent userId={user.uid} provider={provider} />
        ) : (
          <div className="flex w-full max-w-4xl flex-col items-center gap-10">
            <BecomeProviderMarketingHeader />
            <ProviderBenefits />
            <ProviderSignInGate />
            <BecomeProviderClientLink />
          </div>
        )}
      </main>
    </div>
  );
}
