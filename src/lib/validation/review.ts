import { z } from 'zod';

export const reviewInputSchema = z.object({
  rating: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  comment: z
    .string()
    .trim()
    .min(10, 'Le commentaire doit contenir au moins 10 caractères')
    .max(500, 'Le commentaire ne peut pas dépasser 500 caractères'),
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;
