'use client';

import { WhatsappCompletionDialog } from '@/components/account/WhatsappCompletionDialog';
import { AppHeader } from '@/components/layout/AppHeader';
import { AuthProvider } from '@/hooks/useAuth';
import { ProfileGateProvider } from '@/hooks/useProfileGate';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AuthProvider>
      <ProfileGateProvider>
        <AppHeader />
        <div className="flex min-h-[calc(100dvh-3.5rem)] flex-1 flex-col">
          {children}
        </div>
        <WhatsappCompletionDialog />
      </ProfileGateProvider>
    </AuthProvider>
  );
}
