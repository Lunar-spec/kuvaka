export interface Message {
    id: string
    content: string
    sender: 'user' | 'ai'
    timestamp: Date
    image?: string
}

export interface Chatroom {
    id: string
    title: string
    lastMessage?: Message
    createdAt: Date
    messages: Message[]
}

export interface ChatState {
    chatrooms: Chatroom[]
    activeChatroom: string | null
    isTyping: boolean
    searchQuery: string

    // Chatroom management
    createChatroom: (title: string) => string
    deleteChatroom: (id: string) => void
    setActiveChatroom: (id: string | null) => void

    // Message management
    sendMessage: (chatroomId: string, content: string, image?: string) => void
    simulateAIResponse: (chatroomId: string) => void
    loadMoreMessages: (chatroomId: string, page: number) => Message[]

    // UI state
    setTyping: (typing: boolean) => void
    setSearchQuery: (query: string) => void

    // Getters
    getActiveChatroom: () => Chatroom | null
    getFilteredChatrooms: () => Chatroom[]
    getChatroomMessages: (chatroomId: string, page?: number) => Message[]
}
