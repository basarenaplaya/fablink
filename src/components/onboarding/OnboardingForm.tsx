'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { ImagePlus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  MANUFACTURING_CATEGORIES,
  MAX_PORTFOLIO_IMAGES,
  TUNISIAN_CITIES,
} from '@/lib/constants';
import { copy } from '@/lib/copy';
import { isValidWhatsapp, sanitizeWhatsapp } from '@/lib/whatsapp';
import { useAuth } from '@/hooks/useAuth';
import { createProviderProfile } from '@/services/providers.service';
import { updateUserRole } from '@/services/users.service';
import { uploadPortfolioImages } from '@/services/upload.service';
import type { ManufacturingCategory } from '@/types';
import type { TunisianCity } from '@/lib/constants';

const onboardingSchema = z.object({
  name: z.string().trim().min(2, 'Shop name must be at least 2 characters'),
  whatsapp: z
    .string()
    .trim()
    .refine(isValidWhatsapp, 'Use format 216XXXXXXXX (8 digits after 216)'),
  category: z
    .array(z.enum(['3d-printing', 'cnc', 'pcb']))
    .min(1, 'Select at least one service'),
  city: z.enum(
    TUNISIAN_CITIES as unknown as [TunisianCity, ...TunisianCity[]],
  ),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters'),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

interface OnboardingFormProps {
  userId: string;
}

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const router = useRouter();
  const { getIdToken, refreshProfile } = useAuth();
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      whatsapp: '',
      category: [],
      city: 'Tunis',
      description: '',
    },
  });

  const selectedCategories = watch('category');
  const cityValue = watch('city');

  function handlePortfolioChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setPortfolioError(null);

    if (files.length > MAX_PORTFOLIO_IMAGES) {
      setPortfolioError(`Maximum ${MAX_PORTFOLIO_IMAGES} images allowed`);
      return;
    }

    setPortfolioFiles(files);
  }

  function handleInvalidSubmit(fieldErrors: FieldErrors<OnboardingFormValues>) {
    const firstMessage = Object.values(fieldErrors).find(
      (fieldError) => fieldError?.message,
    )?.message;

    toast.error(
      typeof firstMessage === 'string'
        ? firstMessage
        : copy.common.fixFields,
    );
  }

  async function onSubmit(values: OnboardingFormValues) {
    setPortfolioError(null);

    if (portfolioFiles.length === 0) {
      setPortfolioError('Ajoutez au moins une image de portfolio');
      toast.error('Ajoutez au moins une image de portfolio');
      return;
    }

    const idToken = await getIdToken(true);
    if (!idToken) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
      router.replace('/signup/client?redirect=/become-provider');
      return;
    }

    setIsSubmitting(true);

    try {
      const images = await uploadPortfolioImages(
        portfolioFiles,
        userId,
        idToken,
      );

      await createProviderProfile({
        id: userId,
        name: values.name.trim(),
        category: values.category,
        city: values.city,
        description: values.description.trim(),
        whatsapp: sanitizeWhatsapp(values.whatsapp),
        images,
        verified: false,
        createdAt: new Date().toISOString(),
      });

      await updateUserRole(userId, 'provider');
      await refreshProfile();

      toast.success(copy.onboarding.success);
      router.replace('/');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Échec de la soumission du profil';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl text-zinc-50">
          {copy.onboarding.title}
        </CardTitle>
        <CardDescription className="text-zinc-400">
          {copy.onboarding.subtitle}
        </CardDescription>
      </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">{copy.onboarding.shopName}</FieldLabel>
                <Input
                  id="name"
                  placeholder="e.g. Tunis 3D Lab"
                  aria-invalid={!!errors.name}
                  className="min-h-11 border-zinc-700 bg-zinc-900/80"
                  {...register('name')}
                />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field data-invalid={!!errors.whatsapp}>
                <FieldLabel htmlFor="whatsapp">{copy.onboarding.whatsapp}</FieldLabel>
                <Input
                  id="whatsapp"
                  placeholder="216XXXXXXXX"
                  aria-invalid={!!errors.whatsapp}
                  className="min-h-11 border-zinc-700 bg-zinc-900/80"
                  {...register('whatsapp')}
                />
                <FieldDescription>
                  Format Tunisie — 216 suivi de 8 chiffres, sans espaces ni +.
                </FieldDescription>
                <FieldError errors={[errors.whatsapp]} />
              </Field>

              <Field data-invalid={!!errors.category}>
                <FieldLabel>{copy.onboarding.services}</FieldLabel>
                <ToggleGroup
                  type="multiple"
                  variant="outline"
                  spacing={2}
                  value={selectedCategories}
                  onValueChange={(value) =>
                    setValue('category', value as ManufacturingCategory[], {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  className="flex w-full flex-wrap justify-start gap-2"
                >
                  {MANUFACTURING_CATEGORIES.map((item) => (
                    <ToggleGroupItem
                      key={item.value}
                      value={item.value}
                      className="min-h-11 flex-1 border-zinc-700 bg-zinc-900/60 px-4 data-[state=on]:border-zinc-500 data-[state=on]:bg-zinc-800"
                    >
                      {item.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <FieldError errors={[errors.category]} />
              </Field>

              <Field data-invalid={!!errors.city}>
                <FieldLabel htmlFor="city">{copy.onboarding.city}</FieldLabel>
                <Select
                  value={cityValue}
                  onValueChange={(value) =>
                    setValue('city', value as OnboardingFormValues['city'], {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                >
                  <SelectTrigger
                    id="city"
                    aria-invalid={!!errors.city}
                    className="min-h-11 w-full border-zinc-700 bg-zinc-900/80"
                  >
                    <SelectValue placeholder="Sélectionnez votre ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {TUNISIAN_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[errors.city]} />
              </Field>

              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="description">{copy.onboarding.description}</FieldLabel>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Décrivez vos machines, matériaux, délais et spécialités…"
                  aria-invalid={!!errors.description}
                  className="border-zinc-700 bg-zinc-900/80"
                  {...register('description')}
                />
                <FieldDescription>
                  Minimum 20 caractères pour que les clients comprennent vos capacités.
                </FieldDescription>
                <FieldError errors={[errors.description]} />
              </Field>

              <Field data-invalid={!!portfolioError}>
                <FieldLabel htmlFor="portfolio">{copy.onboarding.portfolio}</FieldLabel>
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="portfolio"
                    className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-500 hover:bg-zinc-900/80"
                  >
                    <ImagePlus className="size-6 text-zinc-400" />
                    <span className="text-sm text-zinc-400">
                      {copy.onboarding.portfolioHint(MAX_PORTFOLIO_IMAGES)}
                    </span>
                  </label>
                  <Input
                    id="portfolio"
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={handlePortfolioChange}
                  />
                  {portfolioFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {portfolioFiles.map((file) => (
                        <span
                          key={`${file.name}-${file.lastModified}`}
                          className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
                        >
                          {file.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <FieldError>{portfolioError}</FieldError>
              </Field>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-h-11 w-full active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {copy.onboarding.submitting}
                  </>
                ) : (
                  copy.onboarding.submit
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
  );
}
