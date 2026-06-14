'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { ArrowLeft, FileUp, Loader2 } from 'lucide-react';
import Link from 'next/link';

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
  TUNISIAN_CITIES,
} from '@/lib/constants';
import { copy } from '@/lib/copy';
import { sanitizeWhatsapp } from '@/lib/whatsapp';
import { useAuth } from '@/hooks/useAuth';
import { useProfileGate } from '@/hooks/useProfileGate';
import { createServiceRequest } from '@/services/requests.service';
import { uploadRequestFile } from '@/services/upload.service';
import type { ManufacturingCategory, UserProfile } from '@/types';
import type { TunisianCity } from '@/lib/constants';

const requestSchema = z.object({
  title: z.string().trim().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z
    .string()
    .trim()
    .min(20, 'La description doit contenir au moins 20 caractères'),
  category: z.enum(['3d-printing', 'cnc', 'pcb'], {
    message: 'Sélectionnez une catégorie',
  }),
  city: z.enum(
    TUNISIAN_CITIES as unknown as [TunisianCity, ...TunisianCity[]],
  ),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface RequestFormProps {
  userId: string;
  clientName: string;
  profile: UserProfile;
}

export function RequestForm({ userId, clientName, profile }: RequestFormProps) {
  const router = useRouter();
  const { getIdToken } = useAuth();
  const { requireWhatsapp } = useProfileGate();
  const [requestFile, setRequestFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: '3d-printing',
      city: 'Tunis',
    },
  });

  const categoryValue = watch('category');
  const cityValue = watch('city');

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setFileError(null);
    setRequestFile(file);
  }

  function handleInvalidSubmit(fieldErrors: FieldErrors<RequestFormValues>) {
    const firstMessage = Object.values(fieldErrors).find(
      (fieldError) => fieldError?.message,
    )?.message;

    toast.error(
      typeof firstMessage === 'string'
        ? firstMessage
        : copy.common.fixFields,
    );
  }

  async function onSubmit(values: RequestFormValues) {
    if (!requireWhatsapp()) {
      return;
    }

    if (!profile.whatsapp) {
      return;
    }

    setIsSubmitting(true);

    try {
      const idToken = await getIdToken(true);
      if (!idToken) {
        throw new Error('Vous devez être connecté pour publier une demande');
      }

      const requestId = crypto.randomUUID();
      let fileUrl: string | undefined;
      let fileName: string | undefined;

      if (requestFile) {
        const uploadResult = await uploadRequestFile(
          requestFile,
          userId,
          requestId,
          idToken,
        );
        fileUrl = uploadResult.fileUrl;
        fileName = uploadResult.fileName;
      }

      await createServiceRequest({
        id: requestId,
        userId,
        clientName,
        clientWhatsapp: sanitizeWhatsapp(profile.whatsapp),
        title: values.title,
        description: values.description,
        category: values.category as ManufacturingCategory,
        city: values.city,
        fileUrl,
        fileName,
        createdAt: new Date().toISOString(),
        status: 'pending',
      });

      toast.success(copy.requests.form.success);
      router.replace('/');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Échec de la publication';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
      <CardHeader>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-2 w-fit min-h-9 text-zinc-400"
        >
          <Link href="/">
            <ArrowLeft className="size-4" />
            {copy.requests.form.back}
          </Link>
        </Button>
        <CardTitle className="text-2xl text-zinc-50">{copy.requests.form.title}</CardTitle>
        <CardDescription className="text-zinc-400">
          {copy.requests.form.subtitle}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}
          className="flex flex-col gap-6"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">{copy.requests.form.projectTitle}</FieldLabel>
              <Input
                id="title"
                placeholder={copy.requests.form.projectTitlePlaceholder}
                className="min-h-11 border-zinc-800 bg-zinc-900/70"
                {...register('title')}
              />
              <FieldError errors={[errors.title]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">{copy.requests.form.description}</FieldLabel>
              <Textarea
                id="description"
                rows={5}
                placeholder={copy.requests.form.descriptionPlaceholder}
                className="border-zinc-800 bg-zinc-900/70"
                {...register('description')}
              />
              <FieldError errors={[errors.description]} />
            </Field>

            <Field>
              <FieldLabel>{copy.requests.form.category}</FieldLabel>
              <ToggleGroup
                type="single"
                value={categoryValue}
                onValueChange={(value) => {
                  if (value) {
                    setValue('category', value as ManufacturingCategory, {
                      shouldValidate: true,
                    });
                  }
                }}
                className="flex flex-wrap justify-start gap-2"
              >
                {MANUFACTURING_CATEGORIES.map((category) => (
                  <ToggleGroupItem
                    key={category.value}
                    value={category.value}
                    className="min-h-11 border border-zinc-800 bg-zinc-900/70 px-4 data-[state=on]:border-zinc-600 data-[state=on]:bg-zinc-800"
                  >
                    {category.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <FieldError errors={[errors.category]} />
            </Field>

            <Field>
              <FieldLabel>{copy.requests.form.city}</FieldLabel>
              <Select
                value={cityValue}
                onValueChange={(value) =>
                  setValue('city', value as TunisianCity, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="min-h-11 border-zinc-800 bg-zinc-900/70">
                  <SelectValue placeholder="Sélectionnez une ville" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-950">
                  {TUNISIAN_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.city]} />
            </Field>

            <Field>
              <FieldDescription>
                {copy.requests.form.whatsappFromProfile}
                {profile.whatsapp ? (
                  <span className="mt-1 block font-medium text-zinc-300">
                    {profile.whatsapp}
                  </span>
                ) : null}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="requestFile">
                {copy.requests.form.file}
              </FieldLabel>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="requestFile"
                  className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300"
                >
                  <FileUp className="size-4" />
                  {requestFile ? requestFile.name : copy.requests.form.fileHint}
                </label>
                <input
                  id="requestFile"
                  type="file"
                  accept=".stl,.step,.stp,.iges,.igs,.obj,.3mf,.amf,.zip,.rar,.7z,.gerber,.gbr,.dxf,.dwg,.fcstd,.f3d,.skp,model/*,application/zip,application/octet-stream"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </div>
              {fileError ? (
                <p className="text-sm text-red-400">{fileError}</p>
              ) : null}
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 w-full active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {copy.requests.form.submitting}
              </>
            ) : (
              copy.requests.form.submit
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
