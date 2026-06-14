import { APP_NAME } from '@/lib/constants';
import { getCategoryLabel } from '@/lib/constants';
import type { ManufacturingCategory, UserProfile } from '@/types';

const WHATSAPP_PATTERN = /^216\d{8}$/;

export function sanitizeWhatsapp(input: string): string {
  const digits = input.replace(/\D/g, '');

  if (digits.startsWith('216')) {
    return digits.slice(0, 11);
  }

  if (digits.length === 8) {
    return `216${digits}`;
  }

  return digits;
}

export function isValidWhatsapp(value: string): boolean {
  return WHATSAPP_PATTERN.test(sanitizeWhatsapp(value));
}

export function hasValidUserWhatsapp(
  profile: UserProfile | null | undefined,
): boolean {
  if (!profile?.whatsapp) {
    return false;
  }
  return isValidWhatsapp(profile.whatsapp);
}

const LOCAL_PHONE_PATTERN = /^\d{8}$/;

export function toLocalPhoneDigits(full: string): string {
  const sanitized = sanitizeWhatsapp(full);
  if (sanitized.startsWith('216') && sanitized.length === 11) {
    return sanitized.slice(3);
  }
  return full.replace(/\D/g, '').slice(-8);
}

export function isValidLocalPhone(digits: string): boolean {
  return LOCAL_PHONE_PATTERN.test(digits.replace(/\D/g, ''));
}

export function formatPhoneDisplay(full: string): string {
  const sanitized = sanitizeWhatsapp(full);
  if (!WHATSAPP_PATTERN.test(sanitized)) {
    return full;
  }
  const local = sanitized.slice(3);
  return `+216 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
}

export function buildProviderWhatsAppUrl(
  whatsapp: string,
  providerName: string,
  categories: string[],
): string {
  const sanitized = sanitizeWhatsapp(whatsapp);
  const servicesText =
    categories.length > 0 ? categories.join(', ') : 'manufacturing';

  const message = `Hi! I found you on ${APP_NAME}. I need a ${servicesText} service from ${providerName}. Can you help with my project?`;

  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}

/** @deprecated Use buildProviderWhatsAppUrl */
export const buildWhatsAppUrl = buildProviderWhatsAppUrl;

export function buildClientJobWhatsAppUrl(
  clientWhatsapp: string,
  clientName: string,
  requestTitle: string,
  category: ManufacturingCategory,
): string {
  const sanitized = sanitizeWhatsapp(clientWhatsapp);
  const categoryLabel = getCategoryLabel(category);

  const message = `Hi ${clientName}! I saw your "${requestTitle}" job on ${APP_NAME} for ${categoryLabel} work. I can help with your project — let's discuss the details.`;

  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}
