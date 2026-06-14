'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import type { CarouselApi } from '@/components/ui/carousel';

import { PortfolioLightbox } from '@/components/profile/PortfolioLightbox';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface PortfolioGalleryProps {
  images: string[];
  providerName: string;
}

export function PortfolioGallery({
  images,
  providerName,
}: PortfolioGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const onCarouselSelect = useCallback(() => {
    if (!carouselApi) {
      return;
    }
    setActiveIndex(carouselApi.selectedScrollSnap());
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    onCarouselSelect();
    carouselApi.on('select', onCarouselSelect);

    return () => {
      carouselApi.off('select', onCarouselSelect);
    };
  }, [carouselApi, onCarouselSelect]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/70 text-sm text-zinc-500">
        No portfolio images yet
      </div>
    );
  }

  function openLightbox(index: number) {
    setActiveIndex(index);
    carouselApi?.scrollTo(index);
    setLightboxOpen(true);
  }

  function handleLightboxIndexChange(index: number) {
    setActiveIndex(index);
    carouselApi?.scrollTo(index);
  }

  const hasMultiple = images.length > 1;

  return (
    <>
      <div className="flex flex-col gap-2">
        <Carousel
          setApi={setCarouselApi}
          opts={{ align: 'start', loop: hasMultiple }}
          className="relative w-full"
        >
          <CarouselContent className="-ml-3">
            {images.map((image, index) => (
              <CarouselItem
                key={image}
                className="basis-[85%] pl-3 sm:basis-[70%] md:basis-[55%]"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-transform active:scale-[0.98]"
                  aria-label={`View ${providerName} portfolio image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${providerName} portfolio ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 85vw, 55vw"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>

          {hasMultiple ? (
            <>
              <CarouselPrevious className="left-2 size-11 border-zinc-700 bg-zinc-950/80 text-zinc-50 backdrop-blur-md active:scale-95" />
              <CarouselNext className="right-2 size-11 border-zinc-700 bg-zinc-950/80 text-zinc-50 backdrop-blur-md active:scale-95" />
            </>
          ) : null}
        </Carousel>

        {hasMultiple ? (
          <p className="text-center text-sm text-zinc-500">
            {activeIndex + 1} / {images.length}
          </p>
        ) : null}
      </div>

      <PortfolioLightbox
        images={images}
        activeIndex={activeIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onIndexChange={handleLightboxIndexChange}
        providerName={providerName}
      />
    </>
  );
}
