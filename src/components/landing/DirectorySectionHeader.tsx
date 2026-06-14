'use client';

import { copy } from '@/lib/copy';

export function DirectorySectionHeader() {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
        {copy.landing.directory.title}
      </h2>
    </div>
  );
}
