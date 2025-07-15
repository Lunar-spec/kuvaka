import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, User } from '@/types/auth'

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            otpSent: false,

            setUser: (user) => set({ user }),
            setLoading: (loading) => set({ isLoading: loading }),
            setOtpSent: (sent) => set({ otpSent: sent }),

            login: (phone, countryCode) => {
                const user: User = {
                    id: Date.now().toString(),
                    phone,
                    countryCode,
                    isAuthenticated: true
                }
                set({ user })
            },

            logout: () => {
                set({ user: null, otpSent: false })
            },

            sendOtp: async (phone, countryCode) => {
                set({ isLoading: true })
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000))
                set({ otpSent: true, isLoading: false })
            },

            verifyOtp: async (otp) => {
                set({ isLoading: true })
                // Simulate OTP verification
                await new Promise(resolve => setTimeout(resolve, 1500))
                const isValid = otp === '123456' // Mock validation
                set({ isLoading: false })
                return isValid
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user
            })
        }
    )
)