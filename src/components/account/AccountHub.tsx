'use client';

import { AccountProfileForm } from '@/components/account/AccountProfileForm';
import { AccountQuickLinks } from '@/components/account/AccountQuickLinks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { copy } from '@/lib/copy';
import { useAuth } from '@/hooks/useAuth';
import type { UserProfile } from '@/types';

interface AccountHubProps {
  profile: UserProfile;
}

export function AccountHub({ profile }: AccountHubProps) {
  const { providerProfile } = useAuth();
  const hasProviderProfile = Boolean(providerProfile);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
          {copy.account.title}
        </h1>
        <p className="text-sm text-zinc-400">{copy.account.subtitle}</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="h-auto w-full gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
          <TabsTrigger
            value="profile"
            className="min-h-11 flex-1 rounded-lg px-4 text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-50 data-[state=active]:shadow-none"
          >
            {copy.account.tabs.profile}
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="min-h-11 flex-1 rounded-lg px-4 text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-50 data-[state=active]:shadow-none"
          >
            {copy.account.tabs.activity}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-50">
                {copy.account.tabs.profile}
              </CardTitle>
              <CardDescription className="text-zinc-400">
                {copy.account.profile.profileCardDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccountProfileForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <AccountQuickLinks
            profile={profile}
            hasProviderProfile={hasProviderProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
