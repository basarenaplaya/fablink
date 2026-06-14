'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { TunisiaPhoneInput } from '@/components/forms/TunisiaPhoneInput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { copy } from '@/lib/copy';
import { isValidLocalPhone } from '@/lib/whatsapp';
import { useProfileGate } from '@/hooks/useProfileGate';

export function WhatsappCompletionDialog() {
  const { dialogOpen, saving, saveWhatsapp } = useProfileGate();
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);

    if (!isValidLocalPhone(whatsapp)) {
      setError(copy.whatsappGate.invalid);
      return;
    }

    try {
      await saveWhatsapp(whatsapp);
      setWhatsapp('');
    } catch {
      // toast handled in provider
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={() => {
        // Non-dismissable until saved
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="border-zinc-800 bg-zinc-950/95 backdrop-blur-md sm:max-w-md"
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-zinc-50">
            {copy.whatsappGate.title}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {copy.whatsappGate.description}
          </DialogDescription>
        </DialogHeader>

        <Field data-invalid={!!error}>
          <FieldLabel htmlFor="gate-whatsapp">
            {copy.whatsappGate.label}
          </FieldLabel>
          <TunisiaPhoneInput
            id="gate-whatsapp"
            value={whatsapp}
            onChange={(digits) => {
              setWhatsapp(digits);
              setError(null);
            }}
            aria-invalid={!!error}
          />
          <FieldDescription>{copy.whatsappGate.hint}</FieldDescription>
          <FieldError>{error}</FieldError>
        </Field>

        <Button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="min-h-11 w-full active:scale-95"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {copy.whatsappGate.saving}
            </>
          ) : (
            copy.whatsappGate.save
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
