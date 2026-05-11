import { z } from 'zod'

export const createUrlSchema = z.object({
  original_url: z
    .string()
    .url('Must be a valid URL')
    .max(2048, 'URL must be under 2048 characters'),
  title: z.string().max(255).optional(),
  custom_code: z
    .string()
    .min(3, 'Custom code must be at least 3 characters')
    .max(10, 'Custom code must be at most 10 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, hyphens, and underscores')
    .optional(),
})

export type CreateUrlBody = z.infer<typeof createUrlSchema>
