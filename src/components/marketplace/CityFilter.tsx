'use client';

import { TUNISIAN_CITIES } from '@/lib/constants';
import { copy } from '@/lib/copy';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TunisianCity } from '@/lib/constants';

interface CityFilterProps {
  value: TunisianCity | 'all';
  onChange: (value: TunisianCity | 'all') => void;
}

export function CityFilter({ value, onChange }: CityFilterProps) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => onChange(nextValue as TunisianCity | 'all')}
    >
      <SelectTrigger className="min-h-11 w-full border-zinc-700 bg-zinc-900/70 sm:w-56">
        <SelectValue placeholder={copy.marketplace.allCities} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{copy.marketplace.allCities}</SelectItem>
        {TUNISIAN_CITIES.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
