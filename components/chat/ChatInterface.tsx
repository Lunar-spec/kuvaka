"use client";

import { useChatStore } from "@/stores/useChatStore";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { Bot, Sparkles } from "lucide-react";

interface ChatInterfaceProps {
  chatroomId: string;
}

export function ChatInterface({ chatroomId }: ChatInterfaceProps) {
  const { getActiveChatroom, isTyping } = useChatStore();

  const chatroom = getActiveChatroom();

  if (!chatroom) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="text-center p-8 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">
            No chatroom selected
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Select a chatroom to start your AI conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] ">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-semibold truncate">
              {chatroom.title}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-3 h-3" />
              <span>AI Assistant • {chatroom.messages.length} messages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area - scrollable */}
      <div className="flex-1 overflow-hidden">
        <MessageList chatroomId={chatroomId} />
      </div>

      {/* Typing indicator - fixed above input */}
      {isTyping && (
        <div className="flex-shrink-0 px-6 py-3 border-t backdrop-blur-sm">
          <TypingIndicator />
        </div>
      )}

      {/* Message input - fixed at bottom */}
      <div className="flex-shrink-0 px-6 py-4 border-t backdrop-blur-sm">
        <MessageInput chatroomId={chatroomId} />
      </div>
    </div>
  );
}
