'use client';

import Link from 'next/link';
import { Briefcase, FolderOpen, Store } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { copy } from '@/lib/copy';
import type { UserProfile } from '@/types';

interface AccountQuickLinksProps {
  profile: UserProfile;
  hasProviderProfile: boolean;
}

export function AccountQuickLinks({
  profile,
  hasProviderProfile,
}: AccountQuickLinksProps) {
  if (profile.role === 'provider' && hasProviderProfile) {
    return (
      <div className="flex flex-col gap-4">
        <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-zinc-50">
              <Store className="size-5 text-zinc-400" />
              {copy.account.activity.providerTitle}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {copy.account.activity.providerDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="min-h-11 active:scale-95">
              <Link href={`/providers/${profile.id}`}>
                {copy.account.activity.viewWorkshop}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-zinc-50">
              <Briefcase className="size-5 text-zinc-400" />
              {copy.nav.jobBoard}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Parcourez les demandes de fabrication ouvertes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="min-h-11 border-zinc-700 active:scale-95"
            >
              <Link href="/requests">{copy.nav.jobBoard}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-zinc-50">
          <FolderOpen className="size-5 text-zinc-400" />
          {copy.account.activity.clientTitle}
        </CardTitle>
        <CardDescription className="text-zinc-400">
          {copy.account.activity.clientDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="min-h-11 active:scale-95">
          <Link href="/my-requests">{copy.account.activity.clientCta}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="min-h-11 border-zinc-700 active:scale-95"
        >
          <Link href="/requests/new">{copy.nav.postJob}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
