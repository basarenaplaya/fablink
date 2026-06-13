'use client';

import { useCallback, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

import {
  getCurrentUserIdToken,
  signInWithGoogle as signInWithGoogleService,
  signOutUser,
  subscribeToAuthState,
} from '@/services/auth.service';
import { getUserProfile } from '@/services/users.service';
import type { UserProfile } from '@/types';

interface UseAuthReturn {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userProfile = await getUserProfile(firebaseUser.uid);
        setProfile(userProfile);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load user profile';
        setError(message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const userProfile = await signInWithGoogleService();
      setProfile(userProfile);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);

    try {
      await signOutUser();
      setUser(null);
      setProfile(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to sign out';
      setError(message);
      throw err;
    }
  }, []);

  const getIdToken = useCallback(async (forceRefresh = false) => {
    return getCurrentUserIdToken(forceRefresh);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const userProfile = await getUserProfile(user.uid);
      setProfile(userProfile);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to refresh user profile';
      setError(message);
    }
  }, [user]);

  return {
    user,
    profile,
    loading,
    error,
    signInWithGoogle,
    signOut,
    getIdToken,
    refreshProfile,
  };
}
