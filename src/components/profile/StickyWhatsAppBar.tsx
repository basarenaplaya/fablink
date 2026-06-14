'use client';

import { MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { copy } from '@/lib/copy';
import { buildProviderWhatsAppUrl } from '@/lib/whatsapp';
import { trackWhatsAppClick } from '@/services/analytics.service';
import type { ProviderProfile } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { getCategoryLabel } from '@/lib/constants';

interface StickyWhatsAppBarProps {
  provider: ProviderProfile;
}

export function StickyWhatsAppBar({ provider }: StickyWhatsAppBarProps) {
  const { user } = useAuth();
  const categoryLabels = provider.category.map(getCategoryLabel);
  const whatsappUrl = buildProviderWhatsAppUrl(
    provider.whatsapp,
    provider.name,
    categoryLabels,
  );

  function handleClick() {
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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800/80 bg-zinc-950/90 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <Button
        type="button"
        onClick={handleClick}
        className="min-h-11 w-full active:scale-95"
      >
        <MessageCircle className="size-4" />
        {copy.marketplace.contactWhatsapp}
      </Button>
    </div>
  );
}
