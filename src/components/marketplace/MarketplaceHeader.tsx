'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { APP_NAME } from '@/lib/constants';

interface MarketplaceHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function MarketplaceHeader({
  search,
  onSearchChange,
}: MarketplaceHeaderProps) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium tracking-wide text-zinc-400">
          Tunisia Manufacturing
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
          {APP_NAME}
        </h1>
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
