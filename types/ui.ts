export interface UIState {
    darkMode: boolean
    sidebarOpen: boolean
    loading: {
        messages: boolean
        chatrooms: boolean
        auth: boolean
    }

    toggleDarkMode: () => void
    setSidebarOpen: (open: boolean) => void
    setLoading: (key: keyof UIState['loading'], value: boolean) => void
}