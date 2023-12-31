import {z} from 'zod'
import {UserSchema} from '../user/schema'

export const CreateUserSchema = UserSchema.merge(z.object({
  password: z.string(),
  repassword: z.string()
})).superRefine(({password, repassword}, ctx) => {
  if (password !== repassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords do not match',
      path: ['repassword']
    })
  }
})


export const LoginSchema = UserSchema.pick({username: true}).merge(z.object({
  password: z.string()
}))