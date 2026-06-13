'use client';

import { CategoryFilter } from '@/components/marketplace/CategoryFilter';
import { CityFilter } from '@/components/marketplace/CityFilter';
import { FeaturedProviders } from '@/components/marketplace/FeaturedProviders';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { ProviderFeed } from '@/components/marketplace/ProviderFeed';
import { useProviders } from '@/hooks/useProviders';

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

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950"
      />

      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
        <MarketplaceHeader search={filters.search} onSearchChange={setSearch} />

        <FeaturedProviders providers={featuredProviders} />

        <section className="sticky top-0 z-10 -mx-4 border-y border-zinc-800/80 bg-zinc-950/80 px-4 py-4 backdrop-blur-md">
          <div className="flex flex-col gap-4">
            <CategoryFilter value={filters.category} onChange={setCategory} />
            <CityFilter value={filters.city} onChange={setCity} />
          </div>
        </section>

        <ProviderFeed
          providers={filteredProviders}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  );
}
