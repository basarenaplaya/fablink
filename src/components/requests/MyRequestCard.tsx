'use client';

import { useState } from 'react';
import { CheckCircle2, Download, Loader2, Trash2 } from 'lucide-react';

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getCategoryLabel } from '@/lib/constants';
import { copy } from '@/lib/copy';
import type { ServiceRequest } from '@/types';

interface MyRequestCardProps {
  request: ServiceRequest;
  actionId: string | null;
  onClose: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-TN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function StatusBadge({ status }: { status: ServiceRequest['status'] }) {
  switch (status) {
    case 'pending':
      return (
        <Badge className="bg-amber-500/15 text-amber-300">
          {copy.requests.status.pending}
        </Badge>
      );
    case 'matched':
      return (
        <Badge className="bg-sky-500/15 text-sky-300">
          {copy.requests.status.matched}
        </Badge>
      );
    case 'closed':
      return (
        <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
          {copy.requests.status.closed}
        </Badge>
      );
  }
}

export function MyRequestCard({
  request,
  actionId,
  onClose,
  onDelete,
}: MyRequestCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isActing = actionId === request.id;
  const canClose = request.status === 'pending';

  async function handleConfirmDelete() {
    await onDelete(request.id);
    setDeleteDialogOpen(false);
  }

  return (
    <>
      <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg text-zinc-50">{request.title}</CardTitle>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <StatusBadge status={request.status} />
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-200">
                {getCategoryLabel(request.category)}
              </Badge>
            </div>
          </div>
          <CardDescription className="text-zinc-400">
            {request.city} · {copy.requests.posted} {formatDate(request.createdAt)}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="line-clamp-4 text-sm leading-relaxed text-zinc-400">
            {request.description}
          </p>

          {request.fileUrl ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-fit min-h-9 border-zinc-700 active:scale-95"
            >
              <a
                href={request.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={request.fileName}
              >
                <Download className="size-4" />
                {request.fileName ?? copy.requests.downloadFile}
              </a>
            </Button>
          ) : null}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          {canClose ? (
            <Button
              type="button"
              variant="outline"
              disabled={isActing}
              onClick={() => void onClose(request.id)}
              className="min-h-11 w-full border-zinc-700 active:scale-95 sm:flex-1"
            >
              {isActing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              {copy.requests.markResolved}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="destructive"
            disabled={isActing}
            onClick={() => setDeleteDialogOpen(true)}
            className="min-h-11 w-full active:scale-95 sm:flex-1"
          >
            <Trash2 className="size-4" />
            {copy.requests.delete}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-zinc-50">
              {copy.requests.deleteTitle}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {copy.requests.deleteDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="min-h-11 border-zinc-700 active:scale-95"
            >
              {copy.requests.cancel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isActing}
              onClick={() => void handleConfirmDelete()}
              className="min-h-11 active:scale-95"
            >
              {isActing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Supprimer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
