'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { copy } from '@/lib/copy';
import { useAuth } from '@/hooks/useAuth';
import {
  closeServiceRequest,
  deleteServiceRequest,
  getServiceRequestById,
  listUserServiceRequests,
  RequestServiceError,
} from '@/services/requests.service';
import { deleteCloudinaryAsset } from '@/services/upload.service';
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
  const { getIdToken } = useAuth();
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
        const request = await getServiceRequestById(id);
        if (!request) {
          throw new RequestServiceError('Request not found');
        }
        if (request.userId !== userId) {
          throw new RequestServiceError('Unauthorized');
        }

        if (request.fileUrl) {
          const idToken = await getIdToken(true);
          if (!idToken) {
            throw new RequestServiceError('Session expirée');
          }
          try {
            await deleteCloudinaryAsset(request.fileUrl, idToken);
          } catch (error) {
            console.error('[useMyRequests] Failed to delete request file:', error);
          }
        }

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
    [userId, loadRequests, getIdToken],
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
