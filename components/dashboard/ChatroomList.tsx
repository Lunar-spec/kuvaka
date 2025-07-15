"use client";

import { useChatStore } from "@/stores/useChatStore";
import { ChatroomItem } from "./ChatroomItem";
import { useUIStore } from "@/stores/useUIStore";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";

export function ChatroomList() {
  const { getFilteredChatrooms } = useChatStore();
  const { loading } = useUIStore();
  const chatrooms = getFilteredChatrooms();

  if (loading.chatrooms) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (chatrooms.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">No conversations found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chatrooms.map((chatroom) => (
        <ChatroomItem key={chatroom.id} chatroom={chatroom} />
      ))}
    </div>
  );
}
