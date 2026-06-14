'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toLocalPhoneDigits } from '@/lib/whatsapp';

interface TunisiaPhoneInputProps {
  id?: string;
  value: string;
  onChange: (localDigits: string) => void;
  disabled?: boolean;
  'aria-invalid'?: boolean;
  className?: string;
}

export function TunisiaPhoneInput({
  id,
  value,
  onChange,
  disabled,
  'aria-invalid': ariaInvalid,
  className,
}: TunisiaPhoneInputProps) {
  const localDigits = toLocalPhoneDigits(value);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 8);
    onChange(digits);
  }

  return (
    <div
      className={cn(
        'flex overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900/80',
        ariaInvalid && 'border-red-500/60',
        className,
      )}
    >
      <div className="flex shrink-0 items-center border-r border-zinc-700 bg-zinc-800/90 px-3 py-2 text-sm font-medium tracking-wide text-zinc-300">
        +216
      </div>
      <Input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="XX XXX XXX"
        maxLength={8}
        value={localDigits}
        onChange={handleChange}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        className="min-h-11 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
