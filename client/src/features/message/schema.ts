import {z} from 'zod';
import { UserSchema } from '../user/schema';

export const MessageSchema = z.object({
  id: z.number(),
  body: z.string(),
  sent_at: z.string().nullable().transform((d) => d ? new Date(d) : null).pipe(z.date().nullable()),
  read_at: z.string().nullable().transform((d) => d ? new Date(d) : null).pipe(z.date().nullable()),
  to_user: UserSchema.nullable().optional(),
  from_user: UserSchema.nullable().optional()
})
export const CreateMessageSchema = z.object({
  body: z.string().min(1, { message: 'Must specify message body' }),
  to_username: z.string().refine(username => !username || username !== 'none', { message: 'Must specify receiver\'s username', path: ['to_username'] })
})