"use client";

import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { MessageItem } from "./MessageItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ChevronDown, Bot, User } from "lucide-react";
import {
  generateMessageKey,
  deduplicateMessages,
  sortMessagesByTimestamp,
} from "@/utils/messageUtils";
import type { Message } from "@/types/chat";

interface MessageListProps {
  chatroomId: string;
}

export function MessageList({ chatroomId }: MessageListProps) {
  const { getActiveChatroom, loadMoreMessages } = useChatStore();
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const chatroom = getActiveChatroom();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCount = useRef(0);

  // Load initial messages
  useEffect(() => {
    if (chatroom && initialLoad) {
      const uniqueMessages = deduplicateMessages(chatroom.messages);
      const sortedMessages = sortMessagesByTimestamp(uniqueMessages);
      setAllMessages(sortedMessages);
      setInitialLoad(false);
      setShouldAutoScroll(true);
    }
  }, [chatroom, initialLoad]);

  // Update messages when new ones arrive with deduplication
  useEffect(() => {
    if (chatroom && !initialLoad) {
      const uniqueMessages = deduplicateMessages(chatroom.messages);
      const sortedMessages = sortMessagesByTimestamp(uniqueMessages);
      setAllMessages(sortedMessages);
    }
  }, [chatroom?.messages.length, initialLoad]);

  // Auto-scroll logic - only for initial load and new messages when near bottom
  useEffect(() => {
    if (messagesEndRef.current && !loading) {
      const isNewMessage = allMessages.length > prevMessageCount.current;

      if (shouldAutoScroll || (isNewMessage && isNearBottom)) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        setShouldAutoScroll(false);
      }

      prevMessageCount.current = allMessages.length;
    }
  }, [allMessages.length, loading, shouldAutoScroll, isNearBottom]);

  // Handle scroll events to show/hide scroll button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      const shouldShowButton = distanceFromBottom > 100;
      setShowScrollButton(shouldShowButton);
      setIsNearBottom(distanceFromBottom < 200);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const container = messagesContainerRef.current;
    const scrollTop = container?.scrollTop || 0;
    const scrollHeight = container?.scrollHeight || 0;

    await new Promise((resolve) => setTimeout(resolve, 300));

    const nextPage = currentPage + 1;
    const olderMessages = loadMoreMessages(chatroomId, nextPage);

    if (olderMessages.length > 0) {
      setAllMessages((prev) => {
        const messageMap = new Map();
        olderMessages.forEach((msg) => messageMap.set(msg.id, msg));
        prev.forEach((msg) => messageMap.set(msg.id, msg));

        const uniqueMessages = Array.from(messageMap.values()).sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        return uniqueMessages;
      });
      setCurrentPage(nextPage);

      setTimeout(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          const heightDiff = newScrollHeight - scrollHeight;
          container.scrollTop = scrollTop + heightDiff;
        }
      }, 0);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { containerRef } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    threshold: 100,
    reverse: true,
  });

  const combinedRef = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    messagesContainerRef.current = node;
  };

  if (initialLoad) {
    return (
      <div className="h-full overflow-y-auto p-6 space-y-6">
        <MessageSkeleton />
        <MessageSkeleton />
        <MessageSkeleton />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div
        ref={combinedRef}
        className="h-full overflow-y-auto overscroll-contain px-6 py-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#fff transparent",
        }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Loading indicator for older messages */}
          {loading && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading messages...</span>
              </div>
            </div>
          )}

          {/* Messages */}
          {allMessages.map((message, index) => (
            <MessageItem
              key={generateMessageKey(message, index)}
              message={message}
              isLastMessage={index === allMessages.length - 1}
            />
          ))}

          {/* Empty state */}
          {allMessages.length === 0 && (
            <div className="flex items-center justify-center text-center min-h-[60vh]">
              <div className="p-8 rounded-2xl bg-white/5  backdrop-blur-sm border shadow-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Start a new conversation
                </h3>
                <p className="max-w-sm text-muted-foreground">
                  Ask me anything! I'm here to help with your questions, provide
                  information, or just have a chat.
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-6 z-10 flex items-center justify-center w-12 h-12 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-blue-400/20"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="flex gap-4 max-w-4xl mx-auto">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-3/4 max-w-sm" />
        </div>
      </div>
    </div>
  );
}
