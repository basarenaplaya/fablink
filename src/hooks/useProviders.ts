'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { listProviders } from '@/services/providers.service';
import type { ManufacturingCategory, ProviderProfile } from '@/types';
import type { TunisianCity } from '@/lib/constants';

export interface ProviderFilters {
  category: ManufacturingCategory | 'all';
  city: TunisianCity | 'all';
  search: string;
}

interface UseProvidersReturn {
  providers: ProviderProfile[];
  filteredProviders: ProviderProfile[];
  featuredProviders: ProviderProfile[];
  loading: boolean;
  error: string | null;
  filters: ProviderFilters;
  setCategory: (category: ProviderFilters['category']) => void;
  setCity: (city: ProviderFilters['city']) => void;
  setSearch: (search: string) => void;
  refresh: () => Promise<void>;
}

const DEFAULT_FILTERS: ProviderFilters = {
  category: 'all',
  city: 'all',
  search: '',
};

export function useProviders(): UseProvidersReturn {
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProviderFilters>(DEFAULT_FILTERS);

  const loadProviders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listProviders();
      setProviders(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load providers';
      setError(message);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProviders();
  }, [loadProviders]);

  const filteredProviders = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();

    return providers.filter((provider) => {
      const matchesCategory =
        filters.category === 'all' ||
        provider.category.includes(filters.category);

      const matchesCity =
        filters.city === 'all' || provider.city === filters.city;

      const matchesSearch =
        searchTerm.length === 0 ||
        provider.name.toLowerCase().includes(searchTerm) ||
        provider.description.toLowerCase().includes(searchTerm) ||
        provider.city.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesCity && matchesSearch;
    });
  }, [providers, filters]);

  const featuredProviders = useMemo(
    () => providers.filter((provider) => provider.verified),
    [providers],
  );

  const setCategory = useCallback((category: ProviderFilters['category']) => {
    setFilters((current) => ({ ...current, category }));
  }, []);

  const setCity = useCallback((city: ProviderFilters['city']) => {
    setFilters((current) => ({ ...current, city }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((current) => ({ ...current, search }));
  }, []);

  return {
    providers,
    filteredProviders,
    featuredProviders,
    loading,
    error,
    filters,
    setCategory,
    setCity,
    setSearch,
    refresh: loadProviders,
  };
}
