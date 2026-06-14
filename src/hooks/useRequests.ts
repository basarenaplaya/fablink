'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { listPendingServiceRequests } from '@/services/requests.service';
import type { ManufacturingCategory, ServiceRequest } from '@/types';
import type { TunisianCity } from '@/lib/constants';

export interface RequestFilters {
  category: ManufacturingCategory | 'all';
  city: TunisianCity | 'all';
}

interface UseRequestsReturn {
  requests: ServiceRequest[];
  filteredRequests: ServiceRequest[];
  loading: boolean;
  error: string | null;
  filters: RequestFilters;
  setCategory: (category: RequestFilters['category']) => void;
  setCity: (city: RequestFilters['city']) => void;
  refresh: () => Promise<void>;
}

const DEFAULT_FILTERS: RequestFilters = {
  category: 'all',
  city: 'all',
};

export function useRequests(): UseRequestsReturn {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestFilters>(DEFAULT_FILTERS);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listPendingServiceRequests();
      setRequests(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load requests';
      setError(message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesCategory =
        filters.category === 'all' || request.category === filters.category;

      const matchesCity =
        filters.city === 'all' || request.city === filters.city;

      return matchesCategory && matchesCity;
    });
  }, [requests, filters]);

  const setCategory = useCallback((category: RequestFilters['category']) => {
    setFilters((current) => ({ ...current, category }));
  }, []);

  const setCity = useCallback((city: RequestFilters['city']) => {
    setFilters((current) => ({ ...current, city }));
  }, []);

  return {
    requests,
    filteredRequests,
    loading,
    error,
    filters,
    setCategory,
    setCity,
    refresh: loadRequests,
  };
}
