'use client';

import Link from 'next/link';
import {
  MapPin,
  MessageCircle,
  Pencil,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

import { RatingSummary } from '@/components/reviews/RatingSummary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CopyablePhone } from '@/components/ui/CopyablePhone';
import { getCategoryLabel } from '@/lib/constants';
import { copy } from '@/lib/copy';
import type { ProviderProfile } from '@/types';

interface ProviderProfileSidebarProps {
  provider: ProviderProfile;
  isOwner: boolean;
  onWhatsAppClick: () => void;
}

export function ProviderProfileSidebar({
  provider,
  isOwner,
  onWhatsAppClick,
}: ProviderProfileSidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
              {provider.name}
            </h1>
            <RatingSummary
              average={provider.ratingAverage}
              count={provider.ratingCount}
              size="md"
            />
          </div>
          {provider.verified ? (
            <Badge className="bg-emerald-500/15 text-emerald-300">
              <ShieldCheck className="size-3.5" />
              {copy.marketplace.verified}
            </Badge>
          ) : (
            <Badge variant="outline" className="border-zinc-700 text-zinc-400">
              {copy.marketplace.pending}
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-zinc-500" />
            <span>{provider.city}</span>
          </div>
          <div className="flex items-start gap-2">
            <Wrench className="mt-0.5 size-4 shrink-0 text-zinc-500" />
            <div className="flex flex-wrap gap-2">
              {provider.category.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="bg-zinc-800 text-zinc-200"
                >
                  {getCategoryLabel(category)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-50">
            {copy.profile.about}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {copy.profile.aboutSubtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
            {provider.description}
          </p>
        </CardContent>
      </Card>

      {!isOwner ? (
        <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-zinc-50">
              {copy.phone.label}
            </CardTitle>
            <CardDescription className="text-zinc-500">
              {copy.phone.copyHint}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <CopyablePhone phone={provider.whatsapp} className="w-full" />
            <Button
              type="button"
              onClick={onWhatsAppClick}
              className="hidden min-h-11 w-full active:scale-95 md:inline-flex"
            >
              <MessageCircle className="size-4" />
              {copy.marketplace.contactWhatsapp}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {isOwner ? (
        <Button
          asChild
          variant="outline"
          className="min-h-11 w-full border-zinc-700 active:scale-95 sm:w-auto"
        >
          <Link href="/become-provider">
            <Pencil className="size-4" />
            {copy.profile.editWorkshop}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
