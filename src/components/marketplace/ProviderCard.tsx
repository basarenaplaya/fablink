'use client';

import Image from 'next/image';
import { MessageCircle, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCategoryLabel } from '@/lib/constants';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { trackWhatsAppClick } from '@/services/analytics.service';
import type { ProviderProfile } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface ProviderCardProps {
  provider: ProviderProfile;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const { user } = useAuth();
  const coverImage = provider.images[0];
  const categoryLabels = provider.category.map(getCategoryLabel);
  const whatsappUrl = buildWhatsAppUrl(
    provider.whatsapp,
    provider.name,
    categoryLabels,
  );

  function handleWhatsAppClick() {
    void trackWhatsAppClick({
      providerId: provider.id,
      categories: provider.category,
      clientId: user?.uid,
    }).catch(() => {
      // Analytics should never block the WhatsApp handoff.
    });

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
      <div className="relative aspect-[16/10] w-full bg-zinc-900">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`${provider.name} portfolio`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No portfolio image
          </div>
        )}
      </div>

      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg text-zinc-50">{provider.name}</CardTitle>
            <CardDescription className="text-zinc-400">
              {provider.city}
            </CardDescription>
          </div>
          {provider.verified ? (
            <Badge className="bg-emerald-500/15 text-emerald-300">
              <ShieldCheck className="size-3.5" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="border-zinc-700 text-zinc-400">
              Pending
            </Badge>
          )}
        </div>

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
      </CardHeader>

      <CardContent>
        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
          {provider.description}
        </p>
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          onClick={handleWhatsAppClick}
          className="min-h-11 w-full active:scale-95"
        >
          <MessageCircle className="size-4" />
          Contact via WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}
