'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { PortfolioGallery } from '@/components/profile/PortfolioGallery';
import { ProviderProfileLayout } from '@/components/profile/ProviderProfileLayout';
import { ProviderProfileSidebar } from '@/components/profile/ProviderProfileSidebar';
import { ProviderProfileSkeleton } from '@/components/profile/ProviderProfileSkeleton';
import { ProviderReviewsSection } from '@/components/reviews/ProviderReviewsSection';
import { StickyWhatsAppBar } from '@/components/profile/StickyWhatsAppBar';
import { Button } from '@/components/ui/button';
import { getCategoryLabel } from '@/lib/constants';
import { copy } from '@/lib/copy';
import { buildProviderWhatsAppUrl } from '@/lib/whatsapp';
import { trackWhatsAppClick } from '@/services/analytics.service';
import { getProviderById } from '@/services/providers.service';
import type { ProviderProfile } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface ProviderProfileViewProps {
  provider: ProviderProfile | null;
  loading: boolean;
  error: string | null;
}

export function ProviderProfileView({
  provider,
  loading,
  error,
}: ProviderProfileViewProps) {
  const { user } = useAuth();
  const [displayProvider, setDisplayProvider] = useState<ProviderProfile | null>(
    provider,
  );

  useEffect(() => {
    setDisplayProvider(provider);
  }, [provider]);

  const refreshProvider = useCallback(async () => {
    if (!displayProvider) {
      return;
    }
    const updated = await getProviderById(displayProvider.id);
    if (updated) {
      setDisplayProvider(updated);
    }
  }, [displayProvider]);

  if (loading) {
    return <ProviderProfileSkeleton />;
  }

  if (error || !displayProvider) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-zinc-50">
          {copy.profile.notFound}
        </h1>
        <p className="text-sm text-zinc-400">{copy.profile.notFoundHint}</p>
        <Button asChild className="min-h-11 active:scale-95">
          <Link href="/">
            <ArrowLeft className="size-4" />
            {copy.profile.back}
          </Link>
        </Button>
      </div>
    );
  }

  const categoryLabels = displayProvider.category.map(getCategoryLabel);
  const whatsappUrl = buildProviderWhatsAppUrl(
    displayProvider.whatsapp,
    displayProvider.name,
    categoryLabels,
  );
  const isOwner = user?.uid === displayProvider.id;
  const providerId = displayProvider.id;
  const providerCategories = displayProvider.category;

  function handleWhatsAppClick() {
    void trackWhatsAppClick({
      providerId,
      categories: providerCategories,
      clientId: user?.uid,
    }).catch(() => {
      // Analytics should never block the WhatsApp handoff.
    });

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      <div className="relative flex flex-1 flex-col pb-24 md:pb-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950"
        />

        <ProviderProfileLayout
          backLink={
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="w-fit min-h-9 text-zinc-400"
            >
              <Link href="/">
                <ArrowLeft className="size-4" />
                {copy.profile.back}
              </Link>
            </Button>
          }
          gallery={
            <PortfolioGallery
              images={displayProvider.images}
              providerName={displayProvider.name}
            />
          }
          sidebar={
            <ProviderProfileSidebar
              provider={displayProvider}
              isOwner={isOwner}
              onWhatsAppClick={handleWhatsAppClick}
            />
          }
          reviews={
            <ProviderReviewsSection
              provider={displayProvider}
              onReviewSubmitted={() => void refreshProvider()}
            />
          }
        />
      </div>

      {!isOwner ? <StickyWhatsAppBar provider={displayProvider} /> : null}
    </>
  );
}
