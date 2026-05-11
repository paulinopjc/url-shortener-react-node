import { z } from 'zod'

// block private/internal IPs and non-http schemes
const BLOCKED_HOSTS = /^(localhost|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|0\.0\.0\.0|\[::1\])/i

export const createUrlSchema = z.object({
  original_url: z
    .string()
    .url('Must be a valid URL')
    .max(2048, 'URL must be under 2048 characters')
    .refine((url) => {
      try {
        const parsed = new URL(url)
        if (!['http:', 'https:'].includes(parsed.protocol)) return false
        if (BLOCKED_HOSTS.test(parsed.hostname)) return false
        return true
      } catch {
        return false
      }
    }, 'URL must be a public http or https address'),
  title: z.string().max(255).optional(),
  custom_code: z
    .string()
    .min(3, 'Custom code must be at least 3 characters')
    .max(10, 'Custom code must be at most 10 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, hyphens, and underscores')
    .optional(),
})

export type CreateUrlBody = z.infer<typeof createUrlSchema>
