import Link from 'next/link';

import { copy } from '@/lib/copy';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-zinc-800/80 py-12">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold text-zinc-50">{copy.app.name}</p>
          <p className="text-sm leading-relaxed text-zinc-400">
            {copy.app.tagline}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-zinc-300">
            {copy.landing.footer.navigation}
          </p>
          <nav className="flex flex-col gap-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-zinc-200">
              {copy.landing.footer.home}
            </Link>
            <Link href="/become-provider" className="hover:text-zinc-200">
              {copy.landing.footer.becomeProvider}
            </Link>
            <Link href="/signup/client" className="hover:text-zinc-200">
              {copy.landing.footer.clientSignIn}
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-zinc-300">
            {copy.landing.footer.platform}
          </p>
          <nav className="flex flex-col gap-2 text-sm text-zinc-400">
            <Link href="/requests/new" className="hover:text-zinc-200">
              {copy.landing.footer.postJob}
            </Link>
            <Link href="/requests" className="hover:text-zinc-200">
              {copy.landing.footer.jobBoard}
            </Link>
          </nav>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-zinc-500">
        {copy.landing.footer.copyright(year)}
      </p>
    </footer>
  );
}
