'use client';

import { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  ClipboardList,
  FolderOpen,
  Home,
  Store,
  User,
} from 'lucide-react';

import { copy } from '@/lib/copy';
import { useAuth } from '@/hooks/useAuth';

export interface NavLinkItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function useNavLinks() {
  const { profile, providerProfile, loading } = useAuth();

  const mainNavLinks = useMemo((): NavLinkItem[] => {
    if (loading) {
      return [
        {
          href: '/#annuaire',
          label: copy.nav.providers,
          icon: Home,
        },
      ];
    }

    const links: NavLinkItem[] = [
      {
        href: '/#annuaire',
        label: copy.nav.providers,
        icon: Home,
      },
    ];

    if (!profile) {
      links.push({
        href: '/become-provider',
        label: copy.nav.becomeProvider,
        icon: Store,
      });
      return links;
    }

    if (profile.role === 'client' || profile.role === 'admin') {
      links.push(
        {
          href: '/requests/new',
          label: copy.nav.postJob,
          icon: ClipboardList,
        },
        {
          href: '/my-requests',
          label: copy.nav.myRequests,
          icon: FolderOpen,
        },
      );
    }

    if (profile.role === 'provider') {
      links.push({
        href: '/requests',
        label: copy.nav.jobBoard,
        icon: Briefcase,
      });

      if (providerProfile) {
        links.push({
          href: `/providers/${profile.id}`,
          label: copy.nav.myWorkshop,
          icon: Store,
        });
      } else {
        links.push({
          href: '/become-provider',
          label: copy.nav.listBusiness,
          icon: Store,
        });
      }
    }

    links.push({
      href: '/mon-compte',
      label: copy.nav.myAccount,
      icon: User,
    });

    return links;
  }, [loading, profile, providerProfile]);

  const accountDropdownLinks = useMemo((): NavLinkItem[] => {
    if (!profile) {
      return [];
    }

    return [
      {
        href: '/mon-compte',
        label: copy.nav.myAccount,
        icon: User,
      },
    ];
  }, [profile]);

  return {
    mainNavLinks,
    accountDropdownLinks,
    isAuthenticated: Boolean(profile),
    loading,
  };
}
