'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LoginSkeleton() {
  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/60 backdrop-blur-md">
      <CardHeader className="space-y-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-11 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading, error, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const redirectPath = (() => {
    const redirect = searchParams.get('redirect');
    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
      return redirect;
    }
    return '/';
  })();

  useEffect(() => {
    if (!loading && user && profile) {
      router.replace(redirectPath);
    }
  }, [loading, user, profile, router, redirectPath]);

  async function handleGoogleSignIn() {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      router.replace(redirectPath);
    } catch {
      // Error state is handled by useAuth
    } finally {
      setIsSigningIn(false);
    }
  }

  if (loading || (user && profile)) {
    return (
      <div className="relative flex min-h-full flex-1 items-center justify-center bg-zinc-950 px-4 py-safe">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950"
        />
        <LoginSkeleton />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-full flex-1 items-center justify-center bg-zinc-950 px-4 py-safe">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 size-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"
      />

      <Card className="relative w-full max-w-md border-zinc-800 bg-zinc-950/60 shadow-2xl shadow-black/40 backdrop-blur-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-zinc-50">
            FabLink
          </CardTitle>
          <CardDescription className="text-base text-zinc-400">
            Tunisia&apos;s curated marketplace for 3D printing, CNC, and PCB
            manufacturing.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="min-h-11 w-full border-zinc-700 bg-zinc-900/80 text-zinc-50 hover:bg-zinc-800 active:scale-95"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
          >
            <GoogleIcon />
            {isSigningIn ? 'Signing in...' : 'Continue with Google'}
          </Button>

          {error ? (
            <p className="text-center text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <p className="text-center text-xs text-zinc-500">
            Find vetted providers and connect on WhatsApp in under 30 seconds.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-full flex-1 items-center justify-center bg-zinc-950 px-4 py-safe">
          <LoginSkeleton />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
