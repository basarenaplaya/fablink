'use client';

import { Download, MessageCircle } from 'lucide-react';

import { ClientAvatar } from '@/components/requests/ClientAvatar';
import { RequestFileIcon } from '@/components/requests/RequestFileIcon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CopyablePhone } from '@/components/ui/CopyablePhone';
import { getCategoryLabel } from '@/lib/constants';
import { copy } from '@/lib/copy';
import { buildClientJobWhatsAppUrl } from '@/lib/whatsapp';
import type { ServiceRequest } from '@/types';

interface JobBoardCardProps {
  request: ServiceRequest;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-TN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function JobBoardCard({ request }: JobBoardCardProps) {
  const whatsappUrl = buildClientJobWhatsAppUrl(
    request.clientWhatsapp,
    request.clientName.split(' ')[0] ?? request.clientName,
    request.title,
    request.category,
  );

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 backdrop-blur-md transition-colors hover:border-zinc-700">
      <div className="flex items-start gap-4">
        <ClientAvatar name={request.clientName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="text-lg font-semibold text-zinc-50">
              {request.title}
            </h2>
            <Badge
              variant="secondary"
              className="shrink-0 bg-zinc-800 text-zinc-200"
            >
              {getCategoryLabel(request.category)}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            {request.city} · {formatDate(request.createdAt)}
          </p>
          <div className="mt-2">
            <CopyablePhone phone={request.clientWhatsapp} compact />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800/80 pt-4">
        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
          {request.description}
        </p>
      </div>

      {request.fileUrl ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <RequestFileIcon fileName={request.fileName} />
            <span className="truncate text-sm text-zinc-300">
              {request.fileName ?? 'fichier'}
            </span>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="min-h-9 shrink-0 text-zinc-300 active:scale-95"
          >
            <a
              href={request.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={request.fileName}
            >
              <Download className="size-4" />
              <span className="sr-only">{copy.requests.downloadFile}</span>
            </a>
          </Button>
        </div>
      ) : null}

      <div className="border-t border-zinc-800/80 pt-4">
        <Button asChild className="min-h-11 w-full active:scale-95">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            {copy.requests.board.contactClient}
          </a>
        </Button>
      </div>
    </article>
  );
}
