export function getFromStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue

    try {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
    } catch (error) {
        console.error(`Error reading from localStorage key "${key}":`, error)
        return defaultValue
    }
}

export function setToStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return

    try {
        window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error)
    }
}

export function removeFromStorage(key: string): void {
    if (typeof window === 'undefined') return

    try {
        window.localStorage.removeItem(key)
    } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error)
    }
}
