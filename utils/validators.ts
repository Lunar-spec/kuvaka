export function validatePhone(phone: string): boolean {
    const phoneRegex = /^\d{10,15}$/
    return phoneRegex.test(phone)
}

export function validateOTP(otp: string): boolean {
    const otpRegex = /^\d{6}$/
    return otpRegex.test(otp)
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '')
}