'use client';

import Link from 'next/link';

import { WorkshopForm } from '@/components/workshop/WorkshopForm';
import { ProviderBenefits } from '@/components/provider-funnel/ProviderBenefits';
import { copy } from '@/lib/copy';
import type { ProviderProfile } from '@/types';

interface BecomeProviderContentProps {
  userId: string;
  provider: ProviderProfile | null;
}

export function BecomeProviderContent({
  userId,
  provider,
}: BecomeProviderContentProps) {
  const isEdit = Boolean(provider);

  return (
    <div className="flex w-full max-w-4xl flex-col gap-10">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
          {isEdit ? copy.workshop.manageTitle : copy.providerFunnel.pageTitle}
        </h1>
        <p className="text-sm text-zinc-400 md:text-base">
          {isEdit
            ? copy.workshop.manageSubtitle
            : copy.providerFunnel.pageSubtitle}
        </p>
      </div>

      {!isEdit ? <ProviderBenefits /> : null}

      <WorkshopForm
        userId={userId}
        mode={isEdit ? 'edit' : 'create'}
        initialProvider={provider ?? undefined}
      />

      <p className="text-center text-sm text-zinc-400">
        {copy.auth.provider.clientLink}{' '}
        <Link
          href="/signup/client"
          className="font-medium text-zinc-200 underline-offset-4 hover:underline"
        >
          {copy.auth.provider.clientLinkAction}
        </Link>
      </p>
    </div>
  );
}

export function BecomeProviderMarketingHeader() {
  return (
    <div className="flex flex-col gap-3 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
        {copy.providerFunnel.pageTitle}
      </h1>
      <p className="text-sm text-zinc-400 md:text-base">
        {copy.providerFunnel.pageSubtitle}
      </p>
    </div>
  );
}
