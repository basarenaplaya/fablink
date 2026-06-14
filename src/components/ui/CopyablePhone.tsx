'use client';

import { useState } from 'react';
import { Check, Copy, Phone } from 'lucide-react';
import { toast } from 'sonner';

import { copy } from '@/lib/copy';
import { cn } from '@/lib/utils';
import { formatPhoneDisplay } from '@/lib/whatsapp';

interface CopyablePhoneProps {
  phone: string;
  className?: string;
  compact?: boolean;
}

export function CopyablePhone({
  phone,
  className,
  compact = false,
}: CopyablePhoneProps) {
  const [copied, setCopied] = useState(false);
  const display = formatPhoneDisplay(phone);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(display.replace(/\s/g, ''));
      setCopied(true);
      toast.success(copy.phone.copied);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(copy.common.error);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className={cn(
        'group inline-flex max-w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-left text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900 active:scale-[0.98]',
        compact ? 'px-2.5 py-1.5' : 'min-h-11 px-3 py-2',
        className,
      )}
      title={copy.phone.copyHint}
    >
      <Phone className="size-4 shrink-0 text-zinc-500" />
      <span className="truncate font-medium tabular-nums">{display}</span>
      {copied ? (
        <Check className="size-3.5 shrink-0 text-emerald-400" />
      ) : (
        <Copy className="size-3.5 shrink-0 text-zinc-500 opacity-60 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}
