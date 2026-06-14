'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';

import { copy } from '@/lib/copy';
import { hasValidUserWhatsapp } from '@/lib/whatsapp';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile, UserServiceError } from '@/services/users.service';

interface ProfileGateContextValue {
  needsWhatsapp: boolean;
  dialogOpen: boolean;
  saving: boolean;
  saveWhatsapp: (number: string) => Promise<void>;
  requireWhatsapp: () => boolean;
  openGate: () => void;
}

const ProfileGateContext = createContext<ProfileGateContextValue | null>(null);

export function ProfileGateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const needsWhatsapp = Boolean(
    user && profile && !hasValidUserWhatsapp(profile),
  );

  useEffect(() => {
    if (!loading && needsWhatsapp) {
      setDialogOpen(true);
    }
    if (!loading && !needsWhatsapp) {
      setDialogOpen(false);
    }
  }, [loading, needsWhatsapp]);

  const openGate = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const saveWhatsapp = useCallback(
    async (number: string) => {
      if (!user) {
        return;
      }

      setSaving(true);
      try {
        await updateUserProfile(user.uid, { whatsapp: number });
        await refreshProfile();
        setDialogOpen(false);
        toast.success(copy.whatsappGate.saved);
      } catch (error) {
        const message =
          error instanceof UserServiceError
            ? error.message
            : copy.common.error;
        toast.error(message);
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [refreshProfile, user],
  );

  const requireWhatsapp = useCallback(() => {
    if (!needsWhatsapp) {
      return true;
    }
    setDialogOpen(true);
    toast.info(copy.whatsappGate.required);
    return false;
  }, [needsWhatsapp]);

  const value = useMemo(
    () => ({
      needsWhatsapp,
      dialogOpen,
      saving,
      saveWhatsapp,
      requireWhatsapp,
      openGate,
    }),
    [needsWhatsapp, dialogOpen, saving, saveWhatsapp, requireWhatsapp, openGate],
  );

  return (
    <ProfileGateContext.Provider value={value}>
      {children}
    </ProfileGateContext.Provider>
  );
}

export function useProfileGate(): ProfileGateContextValue {
  const context = useContext(ProfileGateContext);
  if (!context) {
    throw new Error('useProfileGate must be used within ProfileGateProvider');
  }
  return context;
}
