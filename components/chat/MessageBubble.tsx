"use client";

import { useState, useEffect } from "react";
import { Bot, User, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
  isLastMessage: boolean;
}

export function MessageBubble({ message, isLastMessage }: MessageBubbleProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAI = message.sender === "ai";

  useEffect(() => {
    if (isAI && isLastMessage) {
      // Show thinking animation first
      setShowThinking(true);
      setDisplayedText("");

      // After thinking period, start typing effect
      const thinkingTimeout = setTimeout(() => {
        setShowThinking(false);
        setIsTyping(true);

        let currentIndex = 0;
        const fullText = message.content;

        const typingInterval = setInterval(() => {
          if (currentIndex < fullText.length) {
            setDisplayedText(fullText.substring(0, currentIndex + 1));
            currentIndex++;
          } else {
            setIsTyping(false);
            clearInterval(typingInterval);
          }
        }, 30); // Typing speed

        return () => clearInterval(typingInterval);
      }, 1500); // Thinking duration

      return () => clearTimeout(thinkingTimeout);
    } else {
      // For non-AI messages or older AI messages, show immediately
      setDisplayedText(message.content);
      setIsTyping(false);
      setShowThinking(false);
    }
  }, [message.content, isAI, isLastMessage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex gap-4 ${isAI ? "justify-start" : "justify-end"}`}>
      {isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div
        className={`flex flex-col ${
          isAI ? "items-start" : "items-end"
        } max-w-[70%]`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {isAI ? "AI Assistant" : "You"}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-500">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        <div
          className={`relative group px-4 py-3 rounded-2xl shadow-sm ${
            isAI
              ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          }`}
        >
          {showThinking && isAI ? (
            <div className="flex items-center gap-2 py-2">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                AI is thinking...
              </span>
            </div>
          ) : (
            <>
              <div className="whitespace-pre-wrap break-words">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse" />
                )}
              </div>

              {isAI && !isTyping && !showThinking && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {!isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}
