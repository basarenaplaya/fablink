'use client';

import Link from 'next/link';

import { AppMobileNav } from '@/components/layout/AppMobileNav';
import { UserMenu } from '@/components/layout/UserMenu';
import { Button } from '@/components/ui/button';
import { copy } from '@/lib/copy';
import { useNavLinks } from '@/hooks/useNavLinks';

export function AppHeader() {
  const { mainNavLinks } = useNavLinks();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
        <Link
          href="/"
          className="shrink-0 text-lg font-semibold tracking-tight text-zinc-50 transition-opacity hover:opacity-80"
        >
          {copy.app.name}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNavLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              size="sm"
              className="min-h-9 text-zinc-300"
            >
              <Link href={link.href}>
                <link.icon className="size-4" />
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <AppMobileNav />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
