'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { ImagePlus, Loader2, X } from 'lucide-react';
import Image from 'next/image';

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
import { TunisiaPhoneInput } from '@/components/forms/TunisiaPhoneInput';
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
import { isValidLocalPhone, sanitizeWhatsapp, toLocalPhoneDigits } from '@/lib/whatsapp';
import { useAuth } from '@/hooks/useAuth';
import { useProfileGate } from '@/hooks/useProfileGate';
import {
  createProviderProfile,
  updateProviderProfile,
} from '@/services/providers.service';
import { updateUserRole } from '@/services/users.service';
import {
  deleteCloudinaryAsset,
  uploadPortfolioImages,
} from '@/services/upload.service';
import type { ManufacturingCategory, ProviderProfile } from '@/types';
import type { TunisianCity } from '@/lib/constants';

const workshopSchema = z.object({
  name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères'),
  whatsapp: z
    .string()
    .trim()
    .refine(isValidLocalPhone, copy.phone.invalid),
  category: z
    .array(z.enum(['3d-printing', 'cnc', 'pcb']))
    .min(1, 'Sélectionnez au moins un service'),
  city: z.enum(
    TUNISIAN_CITIES as unknown as [TunisianCity, ...TunisianCity[]],
  ),
  description: z
    .string()
    .trim()
    .min(20, 'La description doit contenir au moins 20 caractères'),
});

type WorkshopFormValues = z.infer<typeof workshopSchema>;

interface WorkshopFormProps {
  userId: string;
  mode: 'create' | 'edit';
  initialProvider?: ProviderProfile;
}

export function WorkshopForm({
  userId,
  mode,
  initialProvider,
}: WorkshopFormProps) {
  const router = useRouter();
  const { getIdToken, refreshProfile, refreshProviderProfile, profile } = useAuth();
  const { requireWhatsapp } = useProfileGate();
  const [existingImages, setExistingImages] = useState<string[]>(
    initialProvider?.images ?? [],
  );
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === 'edit';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: initialProvider?.name ?? '',
      whatsapp: toLocalPhoneDigits(
        initialProvider?.whatsapp ?? profile?.whatsapp ?? '',
      ),
      category: initialProvider?.category ?? [],
      city: (initialProvider?.city ?? 'Tunis') as TunisianCity,
      description: initialProvider?.description ?? '',
    },
  });

  useEffect(() => {
    if (initialProvider) {
      reset({
        name: initialProvider.name,
        whatsapp: toLocalPhoneDigits(initialProvider.whatsapp),
        category: initialProvider.category,
        city: initialProvider.city as TunisianCity,
        description: initialProvider.description,
      });
      setExistingImages(initialProvider.images);
    } else if (profile?.whatsapp) {
      setValue('whatsapp', toLocalPhoneDigits(profile.whatsapp));
    }
  }, [initialProvider, profile?.whatsapp, reset, setValue]);

  const selectedCategories = watch('category');
  const cityValue = watch('city');
  const whatsappValue = watch('whatsapp');

  function handlePortfolioChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setPortfolioError(null);

    const totalCount = existingImages.length + files.length;
    if (totalCount > MAX_PORTFOLIO_IMAGES) {
      setPortfolioError(
        copy.workshop.portfolioMax(MAX_PORTFOLIO_IMAGES),
      );
      return;
    }

    setPortfolioFiles(files);
  }

  function removeExistingImage(url: string) {
    setExistingImages((current) => current.filter((image) => image !== url));
  }

  function handleInvalidSubmit(fieldErrors: FieldErrors<WorkshopFormValues>) {
    const firstMessage = Object.values(fieldErrors).find(
      (fieldError) => fieldError?.message,
    )?.message;

    toast.error(
      typeof firstMessage === 'string'
        ? firstMessage
        : copy.common.fixFields,
    );
  }

  async function onSubmit(values: WorkshopFormValues) {
    if (!requireWhatsapp()) {
      return;
    }

    setPortfolioError(null);

    const totalImages = existingImages.length + portfolioFiles.length;
    if (totalImages === 0) {
      setPortfolioError(copy.workshop.portfolioRequired);
      toast.error(copy.workshop.portfolioRequired);
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
      let newImageUrls: string[] = [];
      if (portfolioFiles.length > 0) {
        newImageUrls = await uploadPortfolioImages(
          portfolioFiles,
          userId,
          idToken,
        );
      }

      const images = [...existingImages, ...newImageUrls];

      const providerPayload: ProviderProfile = {
        id: userId,
        name: values.name.trim(),
        category: values.category,
        city: values.city,
        description: values.description.trim(),
        whatsapp: sanitizeWhatsapp(values.whatsapp),
        images,
        verified: initialProvider?.verified ?? false,
        ratingCount: initialProvider?.ratingCount ?? 0,
        ratingAverage: initialProvider?.ratingAverage,
        createdAt:
          initialProvider?.createdAt ?? new Date().toISOString(),
      };

      if (isEdit && initialProvider) {
        await updateProviderProfile(providerPayload, userId);
        await refreshProviderProfile();
        toast.success(copy.workshop.updated);
        router.replace(`/providers/${userId}`);
      } else {
        await createProviderProfile(providerPayload);
        await updateUserRole(userId, 'provider');
        await refreshProfile();
        await refreshProviderProfile();
        toast.success(copy.onboarding.success);
        router.replace('/');
      }

      const removedUrls = (initialProvider?.images ?? []).filter(
        (url) => !images.includes(url),
      );
      if (removedUrls.length > 0) {
        const deleteResults = await Promise.allSettled(
          removedUrls.map((url) => deleteCloudinaryAsset(url, idToken)),
        );
        const failedDeletes = deleteResults.filter(
          (result) => result.status === 'rejected',
        );
        if (failedDeletes.length === removedUrls.length) {
          console.error(
            '[WorkshopForm] Failed to delete all removed portfolio images',
            failedDeletes,
          );
        }
      }
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

  const title = isEdit ? copy.workshop.manageTitle : copy.onboarding.title;
  const subtitle = isEdit
    ? copy.workshop.manageSubtitle
    : copy.onboarding.subtitle;
  const submitLabel = isEdit ? copy.workshop.save : copy.onboarding.submit;

  return (
    <Card className="w-full max-w-2xl border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl text-zinc-50">{title}</CardTitle>
        <CardDescription className="text-zinc-400">{subtitle}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">{copy.onboarding.shopName}</FieldLabel>
              <Input
                id="name"
                placeholder="ex. Tunis 3D Lab"
                aria-invalid={!!errors.name}
                className="min-h-11 border-zinc-700 bg-zinc-900/80"
                {...register('name')}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={!!errors.whatsapp}>
              <FieldLabel htmlFor="whatsapp">
                {copy.onboarding.whatsapp}
              </FieldLabel>
              <TunisiaPhoneInput
                id="whatsapp"
                value={whatsappValue}
                onChange={(digits) =>
                  setValue('whatsapp', digits, { shouldValidate: true })
                }
                aria-invalid={!!errors.whatsapp}
              />
              <FieldDescription>{copy.workshop.whatsappHint}</FieldDescription>
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
                  setValue('city', value as WorkshopFormValues['city'], {
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
              <FieldLabel htmlFor="description">
                {copy.onboarding.description}
              </FieldLabel>
              <Textarea
                id="description"
                rows={5}
                placeholder="Décrivez vos machines, matériaux, délais et spécialités…"
                aria-invalid={!!errors.description}
                className="border-zinc-700 bg-zinc-900/80"
                {...register('description')}
              />
              <FieldDescription>
                Minimum 20 caractères pour que les clients comprennent vos
                capacités.
              </FieldDescription>
              <FieldError errors={[errors.description]} />
            </Field>

            <Field data-invalid={!!portfolioError}>
              <FieldLabel htmlFor="portfolio">
                {copy.onboarding.portfolio}
              </FieldLabel>
              <div className="flex flex-col gap-3">
                {existingImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {existingImages.map((url) => (
                      <div
                        key={url}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-700"
                      >
                        <Image
                          src={url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(url)}
                          className="absolute top-1 right-1 flex size-7 items-center justify-center rounded-full bg-zinc-950/80 text-zinc-200 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label={copy.workshop.removeImage}
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

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
                submitLabel
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
