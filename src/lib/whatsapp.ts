import { APP_NAME } from '@/lib/constants';

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

export function buildWhatsAppUrl(
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
