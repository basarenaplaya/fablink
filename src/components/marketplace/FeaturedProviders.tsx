'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getCategoryLabel } from '@/lib/constants';
import { copy } from '@/lib/copy';
import { RatingSummary } from '@/components/reviews/RatingSummary';
import type { ProviderProfile } from '@/types';

interface FeaturedProvidersProps {
  providers: ProviderProfile[];
}

export function FeaturedProviders({ providers }: FeaturedProvidersProps) {
  if (providers.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-4 text-emerald-400" />
        <h2 className="text-sm font-medium tracking-wide text-zinc-300">
          {copy.landing.directory.featured}
        </h2>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max gap-4 pb-2">
          {providers.map((provider) => (
            <Link
              key={provider.id}
              href={`/providers/${provider.id}`}
              className="group w-64 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-md transition-transform active:scale-[0.98]"
            >
              <div className="relative aspect-[4/3] bg-zinc-900">
                {provider.images[0] ? (
                  <Image
                    src={provider.images[0]}
                    alt={provider.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="256px"
                  />
                ) : null}
              </div>
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium text-zinc-50">
                    {provider.name}
                  </p>
                  <Badge className="bg-emerald-500/15 text-emerald-300">
                    {copy.marketplace.verified}
                  </Badge>
                </div>
                <p className="truncate text-sm text-zinc-400">
                  {provider.city} ·{' '}
                  {provider.category.map(getCategoryLabel).join(', ')}
                </p>
                <RatingSummary
                  average={provider.ratingAverage}
                  count={provider.ratingCount}
                  size="sm"
                />
              </div>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
