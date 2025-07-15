import { useEffect, useRef, useState } from 'react'

interface UseInfiniteScrollProps {
    hasMore: boolean
    loading: boolean
    onLoadMore: () => void
    threshold?: number
    reverse?: boolean
}

export function useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore,
    threshold = 100,
    reverse = false
}: UseInfiniteScrollProps) {
    const [isFetching, setIsFetching] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleScroll = () => {
            if (loading || !hasMore || isFetching) return

            const { scrollTop, scrollHeight, clientHeight } = container

            let shouldLoad = false

            if (reverse) {
                // For reverse infinite scroll (loading older messages at top)
                shouldLoad = scrollTop <= threshold
            } else {
                // For normal infinite scroll (loading newer content at bottom)
                shouldLoad = scrollHeight - scrollTop - clientHeight <= threshold
            }

            if (shouldLoad) {
                setIsFetching(true)
                onLoadMore()
            }
        }

        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
    }, [loading, hasMore, isFetching, threshold, reverse, onLoadMore])

    useEffect(() => {
        if (!loading) {
            setIsFetching(false)
        }
    }, [loading])

    return {
        containerRef,
        isFetching
    }
}