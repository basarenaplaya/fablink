import { MessageCircle, Search, Scale } from 'lucide-react';

import { copy } from '@/lib/copy';

const STEP_ICONS = [Search, Scale, MessageCircle];

export function HowItWorks() {
  return (
    <section className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
          {copy.landing.howItWorks.title}
        </h2>
        <p className="text-sm text-zinc-400">
          {copy.landing.howItWorks.subtitle}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {copy.landing.howItWorks.steps.map((step, index) => {
          const Icon = STEP_ICONS[index];
          return (
            <div
              key={step.title}
              className="flex flex-col items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 text-center backdrop-blur-md"
            >
              <div className="flex size-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-emerald-400">
                <Icon className="size-6" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium tracking-wider text-zinc-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold text-zinc-50">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
