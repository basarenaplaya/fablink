import type { ManufacturingCategory } from '@/types';

export const TUNISIAN_CITIES = [
  'Tunis',
  'Sfax',
  'Sousse',
  'Nabeul',
  'Bizerte',
  'Ben Arous',
  'Ariana',
  'Monastir',
  'Gabes',
] as const;

export type TunisianCity = (typeof TUNISIAN_CITIES)[number];

export const MANUFACTURING_CATEGORIES: ReadonlyArray<{
  value: ManufacturingCategory;
  label: string;
}> = [
  { value: '3d-printing', label: '3D Printing' },
  { value: 'cnc', label: 'CNC' },
  { value: 'pcb', label: 'PCB Manufacturing' },
] as const;

export const APP_NAME = 'FabLink';
export const MAX_PORTFOLIO_IMAGES = 6;

export function getCategoryLabel(value: ManufacturingCategory): string {
  const category = MANUFACTURING_CATEGORIES.find((item) => item.value === value);
  return category?.label ?? value;
}
