import { copy } from '@/lib/copy';

export function JobBoardHero() {
  return (
    <section className="flex flex-col gap-3 py-2 text-center md:text-left">
      <p className="text-sm font-medium tracking-wide text-zinc-400">
        {copy.requests.board.eyebrow}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
        {copy.requests.board.title}
      </h1>
      <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
        {copy.requests.board.subtitle}
      </p>
    </section>
  );
}
