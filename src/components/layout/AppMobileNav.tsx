'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { copy } from '@/lib/copy';
import { useNavLinks } from '@/hooks/useNavLinks';

export function AppMobileNav() {
  const [open, setOpen] = useState(false);
  const { mainNavLinks } = useNavLinks();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 lg:hidden active:scale-95"
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full border-zinc-800 bg-zinc-950/95 backdrop-blur-md sm:max-w-sm"
      >
        <SheetHeader>
          <SheetTitle className="text-left text-zinc-50">
            {copy.app.name}
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2">
          {mainNavLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              className="min-h-11 w-full justify-start gap-3 text-zinc-200 active:scale-95"
              onClick={() => setOpen(false)}
            >
              <Link href={link.href}>
                <link.icon className="size-4" />
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
