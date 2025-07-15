import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'

type RouteType = 'protected' | 'auth' | 'public'

export function useRouteGuard(routeType: RouteType = 'public') {
    const router = useRouter()
    const { user } = useAuthStore()

    const isAuthenticated = user?.isAuthenticated === true

    useEffect(() => {
        if (routeType === 'protected' && !isAuthenticated) {
            router.push('/login')
        } else if (routeType === 'auth' && isAuthenticated) {
            router.push('/dashboard')
        }
    }, [isAuthenticated, routeType, router])

    return {
        isAuthenticated,
        user,
        isLoading: routeType === 'protected' ? !isAuthenticated : false
    }
}

// Usage examples:
// In a protected page: const { isLoading } = useRouteGuard('protected')
// In auth pages: useRouteGuard('auth')
// In public pages: useRouteGuard('public') or useRouteGuard()