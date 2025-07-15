export interface User {
    id: string
    phone: string
    countryCode: string
    isAuthenticated: boolean
}

export interface Country {
    name: string
    code: string
    dialCode: string
    flag: string
}

export interface AuthState {
    user: User | null
    isLoading: boolean
    otpSent: boolean
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    setOtpSent: (sent: boolean) => void
    login: (phone: string, countryCode: string) => void
    logout: () => void
    sendOtp: (phone: string, countryCode: string) => Promise<void>
    verifyOtp: (otp: string) => Promise<boolean>
}

export interface CountryState {
    countries: Country[]
    loading: boolean
    error: string | null
    fetchCountries: () => Promise<void>
    getCountryByCode: (code: string) => Country | null
}