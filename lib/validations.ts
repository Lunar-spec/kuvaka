import { z } from 'zod'

export const loginSchema = z.object({
    phone: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be at most 15 digits')
        .regex(/^\d+$/, 'Phone number must contain only digits'),
    countryCode: z.string().min(1, 'Please select a country')
})

export const otpSchema = z.object({
    otp: z.string()
        .length(6, 'OTP must be 6 digits')
        .regex(/^\d+$/, 'OTP must contain only digits')
})

export const chatroomSchema = z.object({
    title: z.string()
        .min(1, 'Chatroom title is required')
        .max(50, 'Chatroom title must be at most 50 characters')
})

export const messageSchema = z.object({
    content: z.string()
        .min(1, 'Message cannot be empty')
        .max(1000, 'Message must be at most 1000 characters')
})

export type LoginFormData = z.infer<typeof loginSchema>
export type OTPFormData = z.infer<typeof otpSchema>
export type ChatroomFormData = z.infer<typeof chatroomSchema>
export type MessageFormData = z.infer<typeof messageSchema>
