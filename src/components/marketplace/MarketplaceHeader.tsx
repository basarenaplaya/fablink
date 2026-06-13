'use client';

import Link from 'next/link';
import { Search, Store } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_NAME } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

interface MarketplaceHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function MarketplaceHeader({
  search,
  onSearchChange,
}: MarketplaceHeaderProps) {
  const { user } = useAuth();

  const listHref = user ? '/onboarding' : '/login?redirect=/onboarding';

  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium tracking-wide text-zinc-400">
            Tunisia Manufacturing
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
            {APP_NAME}
          </h1>
        </div>
        <Button
          asChild
          variant="outline"
          className="min-h-11 shrink-0 border-zinc-700 bg-zinc-900/70 active:scale-95"
        >
          <Link href={listHref}>
            <Store className="size-4" />
            <span className="hidden sm:inline">List your business</span>
            <span className="sm:hidden">List</span>
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search providers, services, cities..."
          className="min-h-11 border-zinc-800 bg-zinc-900/70 pl-10"
        />
      </div>
    </header>
  );
}
