'use client';

import { useCallback, useEffect, useState } from 'react';

import { getProviderById } from '@/services/providers.service';
import type { ProviderProfile } from '@/types';

interface UseProviderReturn {
  provider: ProviderProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useProvider(id: string): UseProviderReturn {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProvider = useCallback(async () => {
    if (!id) {
      setProvider(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getProviderById(id);
      setProvider(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load provider';
      setError(message);
      setProvider(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadProvider();
  }, [loadProvider]);

  return {
    provider,
    loading,
    error,
    refresh: loadProvider,
  };
}
