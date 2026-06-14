'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { copy } from '@/lib/copy';

import { MyRequestsView } from '@/components/requests/MyRequestsView';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useMyRequests } from '@/hooks/useMyRequests';

function MyRequestsPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-4 w-full max-w-md" />
      <Skeleton className="h-52 w-full" />
    </div>
  );
}

export default function MyRequestsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const {
    requests,
    loading: requestsLoading,
    error,
    actionId,
    closeRequest,
    deleteRequest,
  } = useMyRequests(user?.uid ?? '');

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace('/signup/client?redirect=/my-requests');
      return;
    }

    if (profile?.role === 'provider') {
      toast.info(copy.redirects.providerToJobBoard);
      router.replace('/requests');
    }
  }, [authLoading, user, profile, router]);

  if (authLoading || !user || !profile) {
    return <MyRequestsPageSkeleton />;
  }

  if (profile.role === 'provider') {
    return <MyRequestsPageSkeleton />;
  }

  return (
    <MyRequestsView
      requests={requests}
      loading={requestsLoading}
      error={error}
      actionId={actionId}
      onClose={closeRequest}
      onDelete={deleteRequest}
    />
  );
}
