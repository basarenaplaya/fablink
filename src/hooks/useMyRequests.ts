'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { copy } from '@/lib/copy';
import {
  closeServiceRequest,
  deleteServiceRequest,
  listUserServiceRequests,
  RequestServiceError,
} from '@/services/requests.service';
import type { ServiceRequest } from '@/types';

interface UseMyRequestsReturn {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
  actionId: string | null;
  refresh: () => Promise<void>;
  closeRequest: (id: string) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
}

export function useMyRequests(userId: string): UseMyRequestsReturn {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    if (!userId) {
      setRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await listUserServiceRequests(userId);
      setRequests(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : copy.requests.toasts.loadError;
      setError(message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const closeRequest = useCallback(
    async (id: string) => {
      setActionId(id);

      try {
        await closeServiceRequest(id, userId);
        toast.success(copy.requests.toasts.closed);
        await loadRequests();
      } catch (err) {
        const message =
          err instanceof RequestServiceError
            ? err.message
            : err instanceof Error
              ? err.message
              : copy.requests.toasts.closeError;
        toast.error(message);
      } finally {
        setActionId(null);
      }
    },
    [userId, loadRequests],
  );

  const deleteRequest = useCallback(
    async (id: string) => {
      setActionId(id);

      try {
        await deleteServiceRequest(id, userId);
        toast.success(copy.requests.toasts.deleted);
        await loadRequests();
      } catch (err) {
        const message =
          err instanceof RequestServiceError
            ? err.message
            : err instanceof Error
              ? err.message
              : copy.requests.toasts.deleteError;
        toast.error(message);
      } finally {
        setActionId(null);
      }
    },
    [userId, loadRequests],
  );

  return {
    requests,
    loading,
    error,
    actionId,
    refresh: loadRequests,
    closeRequest,
    deleteRequest,
  };
}
