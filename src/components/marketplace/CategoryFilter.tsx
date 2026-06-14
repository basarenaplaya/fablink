'use client';

import { MANUFACTURING_CATEGORIES } from '@/lib/constants';
import { copy } from '@/lib/copy';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ManufacturingCategory } from '@/types';

interface CategoryFilterProps {
  value: ManufacturingCategory | 'all';
  onChange: (value: ManufacturingCategory | 'all') => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      spacing={2}
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onChange(nextValue as ManufacturingCategory | 'all');
        }
      }}
      className="flex w-full flex-wrap justify-start gap-2"
    >
      <ToggleGroupItem
        value="all"
        className="min-h-11 border-zinc-700 bg-zinc-900/60 px-4 data-[state=on]:border-zinc-500 data-[state=on]:bg-zinc-800"
      >
        {copy.marketplace.allCategories}
      </ToggleGroupItem>
      {MANUFACTURING_CATEGORIES.map((category) => (
        <ToggleGroupItem
          key={category.value}
          value={category.value}
          className="min-h-11 border-zinc-700 bg-zinc-900/60 px-4 data-[state=on]:border-zinc-500 data-[state=on]:bg-zinc-800"
        >
          {category.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
