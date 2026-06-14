'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { copy } from '@/lib/copy';
import { useAuth } from '@/hooks/useAuth';
import { useNavLinks } from '@/hooks/useNavLinks';
import type { UserRole } from '@/types';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function roleLabel(role: UserRole): string {
  return copy.nav.roles[role];
}

export function UserMenu() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const { accountDropdownLinks } = useNavLinks();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      router.replace('/');
    } catch {
      // error surfaced via useAuth
    } finally {
      setSigningOut(false);
    }
  }

  if (loading) {
    return <Skeleton className="size-9 rounded-full" />;
  }

  if (!user || !profile) {
    return (
      <Button asChild size="sm" className="min-h-11 active:scale-95">
        <Link href="/signup/client">{copy.nav.signIn}</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 rounded-full active:scale-95"
          aria-label="Ouvrir le menu du compte"
        >
          <Avatar size="sm">
            {user.photoURL ? (
              <AvatarImage src={user.photoURL} alt={profile.name} />
            ) : null}
            <AvatarFallback className="bg-zinc-800 text-zinc-200">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 border-zinc-800 bg-zinc-950/95 backdrop-blur-md"
      >
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="font-medium text-zinc-50">{profile.name}</span>
          <span className="text-xs font-normal text-zinc-400">
            {profile.email}
          </span>
          <Badge
            variant="secondary"
            className="mt-1 w-fit bg-zinc-800 text-zinc-300"
          >
            {roleLabel(profile.role)}
          </Badge>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-zinc-800" />

        <DropdownMenuGroup>
          {accountDropdownLinks.map((link) => (
            <DropdownMenuItem key={link.href} asChild>
              <Link href={link.href} className="cursor-pointer">
                <link.icon className="size-4" />
                {link.label}
              </Link>
            </DropdownMenuItem>
          ))}

          {profile.role === 'admin' && (
            <DropdownMenuItem disabled>
              <User className="size-4" />
              {copy.nav.adminSoon}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-zinc-800" />

        <DropdownMenuItem
          onClick={() => void handleSignOut()}
          disabled={signingOut}
          className="cursor-pointer text-red-400 focus:text-red-300"
        >
          <LogOut className="size-4" />
          {copy.nav.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
