import {z} from 'zod';

export const UserSchema = z.object({
  username: z.string().min(3),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().min(1),
})