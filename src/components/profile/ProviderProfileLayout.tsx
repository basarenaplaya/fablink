import type { ReactNode } from 'react';

interface ProviderProfileLayoutProps {
  backLink: ReactNode;
  gallery: ReactNode;
  sidebar: ReactNode;
  reviews: ReactNode;
}

export function ProviderProfileLayout({
  backLink,
  gallery,
  sidebar,
  reviews,
}: ProviderProfileLayoutProps) {
  return (
    <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      {backLink}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <div className="lg:sticky lg:top-20">{gallery}</div>
        <div className="flex flex-col gap-6">{sidebar}</div>
      </div>

      <div className="border-t border-zinc-800/80 pt-8">{reviews}</div>
    </main>
  );
}
