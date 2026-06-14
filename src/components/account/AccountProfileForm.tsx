'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { TunisiaPhoneInput } from '@/components/forms/TunisiaPhoneInput';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { copy } from '@/lib/copy';
import { isValidLocalPhone, toLocalPhoneDigits } from '@/lib/whatsapp';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile, UserServiceError } from '@/services/users.service';
import type { UserProfile } from '@/types';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères'),
  whatsapp: z
    .string()
    .trim()
    .refine(isValidLocalPhone, copy.phone.invalid),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface AccountProfileFormProps {
  profile: UserProfile;
}

export function AccountProfileForm({ profile }: AccountProfileFormProps) {
  const { refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      whatsapp: toLocalPhoneDigits(profile.whatsapp ?? ''),
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setSaving(true);
    try {
      await updateUserProfile(profile.id, {
        name: values.name,
        whatsapp: values.whatsapp,
      });
      await refreshProfile();
      toast.success(copy.account.profile.saved);
    } catch (error) {
      const message =
        error instanceof UserServiceError
          ? error.message
          : copy.common.error;
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="account-name">
            {copy.account.profile.name}
          </FieldLabel>
          <Input
            id="account-name"
            className="min-h-11 border-zinc-800 bg-zinc-900/70"
            {...register('name')}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="account-email">
            {copy.account.profile.email}
          </FieldLabel>
          <Input
            id="account-email"
            value={profile.email}
            readOnly
            disabled
            className="min-h-11 border-zinc-800 bg-zinc-900/40 text-zinc-500"
          />
          <FieldDescription>
            {copy.account.profile.emailReadonly}
          </FieldDescription>
        </Field>

        <Field data-invalid={!!errors.whatsapp}>
          <FieldLabel htmlFor="account-whatsapp">
            {copy.account.profile.whatsapp}
          </FieldLabel>
          <Controller
            name="whatsapp"
            control={control}
            render={({ field }) => (
              <TunisiaPhoneInput
                id="account-whatsapp"
                value={field.value}
                onChange={field.onChange}
                aria-invalid={!!errors.whatsapp}
              />
            )}
          />
          <FieldDescription>{copy.phone.localHint}</FieldDescription>
          <FieldError errors={[errors.whatsapp]} />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={saving}
        className="min-h-11 w-full active:scale-95 sm:w-auto"
      >
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {copy.account.profile.saving}
          </>
        ) : (
          copy.account.profile.save
        )}
      </Button>
    </form>
  );
}
