'use client';

import { Suspense } from 'react';

import { ClientSignupView } from '@/components/auth/ClientSignupView';
import { Skeleton } from '@/components/ui/skeleton';

function SignupPageSkeleton() {
  return (
    <div className="relative flex min-h-[calc(100dvh-3.5rem)] flex-1 items-center justify-center bg-zinc-950 px-4 py-safe">
      <Skeleton className="relative z-10 h-64 w-full max-w-md rounded-xl" />
    </div>
  );
}

export default function ClientSignupPage() {
  return (
    <div className="relative flex min-h-[calc(100dvh-3.5rem)] flex-1 items-center justify-center bg-zinc-950 px-4 py-safe">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950"
      />
      <Suspense fallback={<SignupPageSkeleton />}>
        <div className="relative z-10 w-full max-w-md">
          <ClientSignupView />
        </div>
      </Suspense>
    </div>
  );
}
