import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatState, Message, Chatroom } from '@/types/chat'

const AI_RESPONSES = [
    "I appreciate your question! This is a complex subject with multiple perspectives that deserve careful consideration. The fundamental principles involve interconnected systems where changes in one area can have cascading effects throughout.\n\nFrom a historical standpoint, we can see patterns that provide valuable insights into future developments. Any approach should be both flexible and grounded in evidence-based reasoning, balancing theoretical understanding with practical application.",

    "Thank you for bringing this up! This fascinating topic involves understanding how different variables interact within a larger framework. The interaction isn't simply linear – it's more like a web of connections where each element influences others.\n\nWhat's particularly interesting is how this relates to broader trends across various domains. I'd recommend starting with a solid foundation in the basics before moving to more advanced concepts, building understanding progressively.",

    "That's an excellent question that sits at the intersection of several important domains! When we examine this from multiple angles, we see patterns and connections that demonstrate the importance of systems thinking. Rather than viewing elements in isolation, we need to understand how they function as an interconnected whole.\n\nThis perspective reveals emergent properties that arise from component interactions. Effective solutions often require a holistic approach addressing multiple aspects simultaneously, coordinating efforts to avoid creating problems in other areas."
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

                // Simulate AI thinking time (2-4 seconds)
                const thinkingTime = Math.random() * 2000 + 2000 + Math.random() * 2000;

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

                const startIndex = page * messagesPerPage

                let dummyMessagesNeeded = messagesPerPage
                if (page === 0) {
                    dummyMessagesNeeded = Math.max(0, messagesPerPage - existingMessagesCount)
                }

                if (dummyMessagesNeeded === 0) {
                    return []
                }

                const oldestExistingTimestamp = chatroom.messages.length > 0
                    ? Math.min(...chatroom.messages.map(m => new Date(m.timestamp).getTime()))
                    : Date.now()

                const dummyMessages: Message[] = Array.from({ length: dummyMessagesNeeded }, (_, i) => ({
                    id: `dummy-${page}-${i}-${Date.now()}`,
                    content: `This is a dummy message ${startIndex + i + 1}`,
                    sender: Math.random() > 0.5 ? 'user' : 'ai',
                    timestamp: new Date(oldestExistingTimestamp - (startIndex + i + 1) * 60000)
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