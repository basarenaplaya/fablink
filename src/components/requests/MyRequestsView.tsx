'use client';

import Link from 'next/link';
import { ClipboardList } from 'lucide-react';

import { MyRequestCard } from '@/components/requests/MyRequestCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { copy } from '@/lib/copy';
import type { ServiceRequest } from '@/types';

interface MyRequestsViewProps {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
  actionId: string | null;
  onClose: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function MyRequestsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-52 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function MyRequestsView({
  requests,
  loading,
  error,
  actionId,
  onClose,
  onDelete,
}: MyRequestsViewProps) {
  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950"
      />

      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
            {copy.requests.myRequests.title}
          </h1>
          <p className="text-sm text-zinc-400">
            {copy.requests.myRequests.subtitle}
          </p>
        </div>

        {loading ? <MyRequestsSkeleton /> : null}

        {!loading && error ? (
          <p className="text-center text-sm text-red-400">{error}</p>
        ) : null}

        {!loading && !error && requests.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-lg font-medium text-zinc-300">
              {copy.requests.myRequests.empty}
            </p>
            <p className="max-w-sm text-sm text-zinc-500">
              {copy.requests.myRequests.emptyHint}
            </p>
            <Button asChild className="min-h-11 active:scale-95">
              <Link href="/requests/new">
                <ClipboardList className="size-4" />
                {copy.requests.myRequests.postJob}
              </Link>
            </Button>
          </div>
        ) : null}

        {!loading && !error && requests.length > 0 ? (
          <div className="flex flex-col gap-4">
            {requests.map((request) => (
              <MyRequestCard
                key={request.id}
                request={request}
                actionId={actionId}
                onClose={onClose}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
}
