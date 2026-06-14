'use client';

import Link from 'next/link';
import { useState } from 'react';

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { copy } from '@/lib/copy';
import { useAuth } from '@/hooks/useAuth';

export function ProviderSignInGate() {
  const { error, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleGoogleSignIn() {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch {
      // Error handled by useAuth
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl animate-in fade-in zoom-in-95 border-zinc-800 bg-zinc-950/70 backdrop-blur-md duration-500 motion-reduce:animate-none">
      <CardHeader>
        <CardTitle className="text-xl text-zinc-50">
          {copy.auth.provider.signInTitle}
        </CardTitle>
        <CardDescription className="text-zinc-400">
          {copy.auth.provider.signInDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleSignInButton
          label={copy.auth.provider.continueGoogle}
          loadingLabel={copy.auth.provider.signingIn}
          isLoading={isSigningIn}
          onClick={() => void handleGoogleSignIn()}
        />
        {error ? (
          <p className="text-center text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function BecomeProviderClientLink() {
  return (
    <p className="text-center text-sm text-zinc-400">
      {copy.auth.provider.clientLink}{' '}
      <Link
        href="/signup/client"
        className="font-medium text-zinc-200 underline-offset-4 hover:underline"
      >
        {copy.auth.provider.clientLinkAction}
      </Link>
    </p>
  );
}
