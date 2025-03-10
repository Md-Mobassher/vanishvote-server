import { z } from 'zod'

export const createPollsValidationSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters long'),
  options: z
    .array(
      z.object({
        choice: z.string().min(1, 'Option cannot be empty'),
        votes: z.number().default(0),
      }),
    )
    .min(2, 'At least two options are required'),
  expiresAt: z.enum(['1min', '1h', '12h', '24h']),
  hideResults: z.boolean().optional(),
})

export const votePollValidationSchema = z.object({
  optionIndex: z.number().min(0, 'Invalid option index'),
})

export const reactPollSchema = z.object({
  reaction: z.enum(['🔥', '👍']),
})

export const commentPollSchema = z.object({
  text: z.string(),
})
