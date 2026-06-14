'use client';

import { useEffect } from 'react';

import { CategoryFilter } from '@/components/marketplace/CategoryFilter';
import { CityFilter } from '@/components/marketplace/CityFilter';
import { FeaturedProviders } from '@/components/marketplace/FeaturedProviders';
import { ProviderFeed } from '@/components/marketplace/ProviderFeed';
import { CategoryShowcase } from '@/components/landing/CategoryShowcase';
import { DirectorySectionHeader } from '@/components/landing/DirectorySectionHeader';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LandingHero } from '@/components/landing/LandingHero';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { WorkshopCallout } from '@/components/landing/WorkshopCallout';
import { useProviders } from '@/hooks/useProviders';
import type { ManufacturingCategory } from '@/types';

function scrollToDirectory() {
  document.getElementById('annuaire')?.scrollIntoView({ behavior: 'smooth' });
}

export default function HomePage() {
  const {
    filteredProviders,
    featuredProviders,
    loading,
    error,
    filters,
    setCategory,
    setCity,
    setSearch,
  } = useProviders();

  useEffect(() => {
    if (window.location.hash === '#annuaire') {
      scrollToDirectory();
    }
  }, []);

  function handleCategorySelect(category: ManufacturingCategory) {
    setCategory(category);
    scrollToDirectory();
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950"
      />

      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4">
        <LandingHero
          search={filters.search}
          onSearchChange={setSearch}
          onExploreClick={scrollToDirectory}
        />

        <CategoryShowcase onCategorySelect={handleCategorySelect} />

        <HowItWorks />

        <WorkshopCallout />

        <section id="annuaire" className="flex scroll-mt-20 flex-col gap-8 py-8">
          <DirectorySectionHeader />

          <FeaturedProviders providers={featuredProviders} />

          <div className="sticky top-14 z-10 -mx-4 border-y border-zinc-800/80 bg-zinc-950/80 px-4 py-4 backdrop-blur-md">
            <div className="flex flex-col gap-4">
              <CategoryFilter value={filters.category} onChange={setCategory} />
              <CityFilter value={filters.city} onChange={setCity} />
            </div>
          </div>

          <ProviderFeed
            providers={filteredProviders}
            loading={loading}
            error={error}
          />
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
