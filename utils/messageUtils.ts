import type { Message } from "@/types/chat";

// Generate a unique key for a message
export function generateMessageKey(message: Message, index: number): string {
    // Use multiple factors to ensure uniqueness
    const timestamp = new Date(message.timestamp).getTime();
    const contentHash = message.content.length; // Simple content hash
    return `${message.id}-${timestamp}-${contentHash}-${index}`;
}

// Deduplicate messages by ID
export function deduplicateMessages(messages: Message[]): Message[] {
    const seen = new Set();
    return messages.filter(message => {
        if (seen.has(message.id)) {
            return false;
        }
        seen.add(message.id);
        return true;
    });
}

// Sort messages by timestamp
export function sortMessagesByTimestamp(messages: Message[]): Message[] {
    return [...messages].sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeA - timeB;
    });
}