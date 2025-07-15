import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatState, Message, Chatroom } from '@/types/chat'

const AI_RESPONSES = [
    "That's an interesting question! Let me think about that...",
    "I understand what you're asking. Here's my perspective...",
    "Based on what you've shared, I'd suggest...",
    "That's a great point! Here's what I think...",
    "I can help you with that. Let me explain...",
    "Thank you for sharing that. My thoughts are...",
    "I see what you mean. From my understanding...",
    "That's something I can definitely help with..."
]

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            chatrooms: [],
            activeChatroom: null,
            isTyping: false,
            searchQuery: '',

            createChatroom: (title) => {
                const newChatroom: Chatroom = {
                    id: Date.now().toString(),
                    title,
                    createdAt: new Date(),
                    messages: []
                }
                set(state => ({
                    chatrooms: [newChatroom, ...state.chatrooms]
                }))
                return newChatroom.id
            },

            deleteChatroom: (id) => {
                set(state => ({
                    chatrooms: state.chatrooms.filter(room => room.id !== id),
                    activeChatroom: state.activeChatroom === id ? null : state.activeChatroom
                }))
            },

            setActiveChatroom: (id) => {
                set({ activeChatroom: id })
            },

            sendMessage: (chatroomId, content, image) => {
                const message: Message = {
                    id: Date.now().toString(),
                    content,
                    sender: 'user',
                    timestamp: new Date(),
                    image
                }

                set(state => ({
                    chatrooms: state.chatrooms.map(room =>
                        room.id === chatroomId
                            ? {
                                ...room,
                                messages: [...room.messages, message],
                                lastMessage: message
                            }
                            : room
                    )
                }))

                // Trigger AI response after a delay
                setTimeout(() => {
                    get().simulateAIResponse(chatroomId)
                }, 1000)
            },

            simulateAIResponse: (chatroomId) => {
                set({ isTyping: true })

                // Simulate AI thinking time (1.5-3 seconds)
                const thinkingTime = Math.random() * 1500 + 1500

                setTimeout(() => {
                    const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]
                    const aiMessage: Message = {
                        id: Date.now().toString(),
                        content: randomResponse,
                        sender: 'ai',
                        timestamp: new Date()
                    }

                    set(state => ({
                        chatrooms: state.chatrooms.map(room =>
                            room.id === chatroomId
                                ? {
                                    ...room,
                                    messages: [...room.messages, aiMessage],
                                    lastMessage: aiMessage
                                }
                                : room
                        ),
                        isTyping: false
                    }))
                }, thinkingTime)
            },

            loadMoreMessages: (chatroomId, page) => {
                const { chatrooms } = get()
                const chatroom = chatrooms.find(room => room.id === chatroomId)
                if (!chatroom) return []

                const messagesPerPage = 20
                const existingMessagesCount = chatroom.messages.length

                // Calculate how many dummy messages we need for this page
                const startIndex = page * messagesPerPage

                // If we're on the first page and have existing messages, 
                // we need fewer dummy messages
                let dummyMessagesNeeded = messagesPerPage
                if (page === 0) {
                    dummyMessagesNeeded = Math.max(0, messagesPerPage - existingMessagesCount)
                }

                // Don't generate dummy messages if we don't need any
                if (dummyMessagesNeeded === 0) {
                    return []
                }

                // Generate dummy historical messages with timestamps older than existing messages
                const oldestExistingTimestamp = chatroom.messages.length > 0
                    ? Math.min(...chatroom.messages.map(m => new Date(m.timestamp).getTime()))
                    : Date.now()

                const dummyMessages: Message[] = Array.from({ length: dummyMessagesNeeded }, (_, i) => ({
                    id: `dummy-${page}-${i}-${Date.now()}`, // Add timestamp to ensure uniqueness
                    content: `This is a dummy message ${startIndex + i + 1}`,
                    sender: Math.random() > 0.5 ? 'user' : 'ai',
                    timestamp: new Date(oldestExistingTimestamp - (startIndex + i + 1) * 60000) // 1 minute intervals going back
                }))

                return dummyMessages
            },

            setTyping: (typing) => set({ isTyping: typing }),
            setSearchQuery: (query) => set({ searchQuery: query }),

            getActiveChatroom: () => {
                const { chatrooms, activeChatroom } = get()
                return chatrooms.find(room => room.id === activeChatroom) || null
            },

            getFilteredChatrooms: () => {
                const { chatrooms, searchQuery } = get()
                if (!searchQuery) return chatrooms
                return chatrooms.filter(room =>
                    room.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
            },

            getChatroomMessages: (chatroomId, page = 0) => {
                const { chatrooms } = get()
                const chatroom = chatrooms.find(room => room.id === chatroomId)
                if (!chatroom) return []

                const messagesPerPage = 20
                const startIndex = page * messagesPerPage
                return chatroom.messages.slice(startIndex, startIndex + messagesPerPage)
            }
        }),
        {
            name: 'chat-storage',
            partialize: (state) => ({
                chatrooms: state.chatrooms
            })
        }
    )
)