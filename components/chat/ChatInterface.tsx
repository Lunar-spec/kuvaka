"use client";

import { useChatStore } from "@/stores/useChatStore";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { Bot, Menu, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { useUIStore } from "@/stores";

interface ChatInterfaceProps {
  chatroomId: string;
}

export function ChatInterface({ chatroomId }: ChatInterfaceProps) {
  const { getActiveChatroom, isTyping } = useChatStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const chatroom = getActiveChatroom();

  if (!chatroom) {
    return (
      <div className="flex h-[100vh] items-center justify-center">
        <div className="text-center p-8 rounded-2xl shadow-xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full">
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
    <div className="flex flex-col h-[100vh]">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-semibold">{chatroom.title}</h1>
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
