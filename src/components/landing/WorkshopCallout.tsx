import Link from 'next/link';
import { Store } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { copy } from '@/lib/copy';

export function WorkshopCallout() {
  return (
    <section className="py-8">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-8 md:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 size-64 rounded-full bg-emerald-500/10 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
              {copy.landing.workshopCallout.title}
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400 md:text-base">
              {copy.landing.workshopCallout.description}
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="min-h-11 shrink-0 active:scale-95"
          >
            <Link href="/become-provider">
              <Store className="size-4" />
              {copy.landing.workshopCallout.cta}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
