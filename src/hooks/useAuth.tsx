'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { User } from 'firebase/auth';

import {
  getCurrentUserIdToken,
  signInWithGoogle as signInWithGoogleService,
  signOutUser,
  subscribeToAuthState,
} from '@/services/auth.service';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { getProviderByUserId } from '@/services/providers.service';
import { getUserProfile } from '@/services/users.service';
import type { ProviderProfile, UserProfile } from '@/types';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  providerProfile: ProviderProfile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  refreshProfile: () => Promise<void>;
  refreshProviderProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [providerProfile, setProviderProfile] =
    useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProviderProfile = useCallback(async (uid: string) => {
    const provider = await getProviderByUserId(uid);
    setProviderProfile(provider);
    return provider;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(null);
        setProviderProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userProfile = await getUserProfile(firebaseUser.uid);
        setProfile(userProfile);
        setError(null);

        if (userProfile?.role === 'provider') {
          await loadProviderProfile(firebaseUser.uid);
        } else {
          setProviderProfile(null);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load user profile';
        setError(message);
        setProfile(null);
        setProviderProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [loadProviderProfile]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const userProfile = await signInWithGoogleService();
      setProfile(userProfile);

      if (userProfile.role === 'provider') {
        await loadProviderProfile(userProfile.id);
      } else {
        setProviderProfile(null);
      }
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadProviderProfile]);

  const signOut = useCallback(async () => {
    setError(null);

    try {
      await signOutUser();
      setUser(null);
      setProfile(null);
      setProviderProfile(null);
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
      setProviderProfile(null);
      return;
    }

    try {
      const userProfile = await getUserProfile(user.uid);
      setProfile(userProfile);
      setError(null);

      if (userProfile?.role === 'provider') {
        await loadProviderProfile(user.uid);
      } else {
        setProviderProfile(null);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to refresh user profile';
      setError(message);
    }
  }, [loadProviderProfile, user]);

  const refreshProviderProfile = useCallback(async () => {
    if (!user) {
      setProviderProfile(null);
      return;
    }

    try {
      await loadProviderProfile(user.uid);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to refresh provider profile';
      setError(message);
    }
  }, [loadProviderProfile, user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      providerProfile,
      loading,
      error,
      signInWithGoogle,
      signOut,
      getIdToken,
      refreshProfile,
      refreshProviderProfile,
    }),
    [
      user,
      profile,
      providerProfile,
      loading,
      error,
      signInWithGoogle,
      signOut,
      getIdToken,
      refreshProfile,
      refreshProviderProfile,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
