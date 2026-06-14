'use client';

import { ProviderCard } from '@/components/marketplace/ProviderCard';
import { MarketplaceSkeleton } from '@/components/marketplace/MarketplaceSkeleton';
import { copy } from '@/lib/copy';
import type { ProviderProfile } from '@/types';

interface ProviderFeedProps {
  providers: ProviderProfile[];
  loading: boolean;
  error: string | null;
}

export function ProviderFeed({ providers, loading, error }: ProviderFeedProps) {
  if (loading) {
    return <MarketplaceSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-10 text-center backdrop-blur-md">
        <p className="text-lg font-medium text-zinc-200">
          {copy.marketplace.noProviders}
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          {copy.marketplace.noProvidersHint}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {providers.map((provider) => (
        <div key={provider.id} id={`provider-${provider.id}`}>
          <ProviderCard provider={provider} />
        </div>
      ))}
    </div>
  );
}
