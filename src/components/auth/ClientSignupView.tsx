'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { copy } from '@/lib/copy';
import { useAuth } from '@/hooks/useAuth';

function SignupSkeleton() {
  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/60 backdrop-blur-md">
      <CardHeader className="space-y-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-11 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function ClientSignupView() {
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
      // Error handled by useAuth
    } finally {
      setIsSigningIn(false);
    }
  }

  if (loading || (user && profile)) {
    return <SignupSkeleton />;
  }

  return (
    <Card className="relative w-full max-w-md border-zinc-800 bg-zinc-950/60 shadow-2xl shadow-black/40 backdrop-blur-md">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight text-zinc-50">
          {copy.auth.client.title}
        </CardTitle>
        <CardDescription className="text-base text-zinc-400">
          {copy.auth.client.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <GoogleSignInButton
          label={copy.auth.client.continueGoogle}
          loadingLabel={copy.auth.client.signingIn}
          isLoading={isSigningIn}
          onClick={() => void handleGoogleSignIn()}
        />

        {error ? (
          <p className="text-center text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <p className="text-center text-xs text-zinc-500">
          {copy.auth.client.footer}
        </p>

        <p className="text-center text-sm text-zinc-400">
          {copy.auth.client.providerLink}{' '}
          <Link
            href="/become-provider"
            className="font-medium text-zinc-200 underline-offset-4 hover:underline"
          >
            {copy.auth.client.providerLinkAction}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
