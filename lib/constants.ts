export const MESSAGES_PER_PAGE = 20
export const OTP_LENGTH = 6
export const AI_THINKING_TIME = { min: 1500, max: 3000 }
export const OTP_EXPIRY_TIME = 300000 // 5 minutes

export const AI_RESPONSES = [
    "That's an interesting question! Let me think about that...",
    "I understand what you're asking. Here's my perspective...",
    "Based on what you've shared, I'd suggest...",
    "That's a great point! Here's what I think...",
    "I can help you with that. Let me explain...",
    "Thank you for sharing that. My thoughts are...",
    "I see what you mean. From my understanding...",
    "That's something I can definitely help with..."
]

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/dashboard',
    CHAT: '/chat'
} as const

// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatTimestamp(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`

    return date.toLocaleDateString()
}

export function formatPhoneNumber(phone: string, countryCode: string): string {
    return `${countryCode} ${phone}`
}

export function generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export function truncateText(text: string, length: number): string {
    return text.length > length ? `${text.substring(0, length)}...` : text
}
