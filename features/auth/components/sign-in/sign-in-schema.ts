import {z} from 'zod'

export const SignInformSchema = z.object({
    email: z
        .email({ message: 'Please enter a valid email'})
        .min(1, {message: 'Please enter your email'}),
    password: z
        .string()
        .min(1, {
            message: 'Please enter your password',
        })
        .min(7, {
            message: 'Password must be at least 7 characters long',
        }),
})

export type SignInFormValues = z.infer<typeof SignInformSchema>