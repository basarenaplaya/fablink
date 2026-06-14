'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PortfolioLightboxProps {
  images: string[];
  activeIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
  providerName: string;
}

export function PortfolioLightbox({
  images,
  activeIndex,
  open,
  onOpenChange,
  onIndexChange,
  providerName,
}: PortfolioLightboxProps) {
  const hasMultiple = images.length > 1;

  function showPrevious() {
    onIndexChange((activeIndex - 1 + images.length) % images.length);
  }

  function showNext() {
    onIndexChange((activeIndex + 1) % images.length);
  }

  const currentImage = images[activeIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[100dvh] max-w-[100vw] border-none bg-black/95 p-0 sm:max-w-4xl"
      >
        <DialogTitle className="sr-only">
          {providerName} portfolio image {activeIndex + 1} of {images.length}
        </DialogTitle>

        <div className="relative flex min-h-[60dvh] items-center justify-center">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={`${providerName} portfolio ${activeIndex + 1}`}
              width={1200}
              height={900}
              className="max-h-[85dvh] w-auto object-contain"
              priority
            />
          ) : null}

          {hasMultiple && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={showPrevious}
                className="absolute top-1/2 left-2 size-11 -translate-y-1/2 rounded-full bg-zinc-900/80 text-zinc-50 active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={showNext}
                className="absolute top-1/2 right-2 size-11 -translate-y-1/2 rounded-full bg-zinc-900/80 text-zinc-50 active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight className="size-5" />
              </Button>
            </>
          )}
        </div>

        {hasMultiple && (
          <p className="pb-4 text-center text-sm text-zinc-400">
            {activeIndex + 1} / {images.length}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
