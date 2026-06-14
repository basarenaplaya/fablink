import { copy } from '@/lib/copy';
import { Eye, MessageCircle, TrendingUp } from 'lucide-react';

const BENEFIT_ICONS = [Eye, MessageCircle, TrendingUp];

export function ProviderBenefits() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {copy.providerFunnel.benefits.map((benefit, index) => {
        const Icon = BENEFIT_ICONS[index];
        return (
          <div
            key={benefit.title}
            className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 backdrop-blur-md"
          >
            <div className="flex size-12 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-emerald-400">
              <Icon className="size-6" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-zinc-50">
                {benefit.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {benefit.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
