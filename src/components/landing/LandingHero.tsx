'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';

import { Stagger } from '@/components/motion/Stagger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { copy } from '@/lib/copy';

interface LandingHeroProps {
  search: string;
  onSearchChange: (value: string) => void;
  onExploreClick: () => void;
}

export function LandingHero({
  search,
  onSearchChange,
  onExploreClick,
}: LandingHeroProps) {
  return (
    <section className="flex flex-col items-center gap-8 py-12 text-center md:py-16">
      <Stagger className="flex max-w-3xl flex-col gap-4">
        <p className="text-sm font-medium tracking-wide text-zinc-400">
          {copy.landing.hero.eyebrow}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-50 md:text-5xl">
          {copy.landing.hero.title}
        </h1>
        <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
          {copy.landing.hero.subtitle}
        </p>
      </Stagger>

      <div className="motion-fade-up motion-ease-premium motion-delay-4 relative w-full max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-500" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={copy.landing.hero.searchPlaceholder}
          className="min-h-12 border-zinc-800 bg-zinc-900/70 pl-11 text-base backdrop-blur-md"
        />
      </div>

      <div className="motion-fade-up motion-ease-premium motion-delay-5 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          size="lg"
          onClick={onExploreClick}
          className="min-h-11 flex-1 active:scale-95"
        >
          {copy.landing.hero.exploreWorkshops}
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="min-h-11 flex-1 border-zinc-700 bg-zinc-900/70 active:scale-95"
        >
          <Link href="/become-provider">{copy.landing.hero.becomeProvider}</Link>
        </Button>
      </div>
    </section>
  );
}
