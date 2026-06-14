'use client';

import { Box, CircuitBoard, Cog } from 'lucide-react';

import { Reveal } from '@/components/motion/Reveal';
import { copy } from '@/lib/copy';
import type { ManufacturingCategory } from '@/types';

interface CategoryShowcaseProps {
  onCategorySelect: (category: ManufacturingCategory) => void;
}

const CATEGORIES = [
  {
    value: '3d-printing' as const,
    icon: Box,
    title: copy.landing.categories.printing3d.title,
    description: copy.landing.categories.printing3d.description,
  },
  {
    value: 'cnc' as const,
    icon: Cog,
    title: copy.landing.categories.cnc.title,
    description: copy.landing.categories.cnc.description,
  },
  {
    value: 'pcb' as const,
    icon: CircuitBoard,
    title: copy.landing.categories.pcb.title,
    description: copy.landing.categories.pcb.description,
  },
];

export function CategoryShowcase({ onCategorySelect }: CategoryShowcaseProps) {
  return (
    <section className="flex flex-col gap-6 py-8">
      <Reveal className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
          {copy.landing.categories.title}
        </h2>
        <p className="text-sm text-zinc-400">{copy.landing.categories.subtitle}</p>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-3">
        {CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          return (
            <Reveal key={category.value} delayMs={index * 80}>
              <button
                type="button"
                onClick={() => onCategorySelect(category.value)}
                className="group flex h-full w-full flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 text-left backdrop-blur-md transition-all hover:border-zinc-600 hover:bg-zinc-900/80 active:scale-[0.98]"
              >
                <div className="flex size-12 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 transition-colors group-hover:border-zinc-600 group-hover:text-zinc-50">
                  <Icon className="size-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-zinc-50">{category.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {category.description}
                  </p>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
