"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/formatters";
import { useToast } from "@/hooks/useToast";
import type { Message } from "@/types/chat";

interface MessageItemProps {
  message: Message;
  isLastMessage?: boolean;
}

export function MessageItem({ message, isLastMessage }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const { showSuccess } = useToast();

  const isUser = message.sender === "user";
  const isAI = message.sender === "ai";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      showSuccess("Copied!", "Message copied to clipboard");

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div
      className={cn(
        "group flex gap-2 transition-all duration-200",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="/gemini-avatar.png" alt="Gemini" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
            <Bot className="h-4 w-4 text-white" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col max-w-[80%] sm:max-w-[70%]",
          isUser && "items-end"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-muted-foreground">
            {isUser ? "You" : "Gemini"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div className="relative">
          <Card
            className={cn(
              "p-4 transition-all duration-200 shadow-2xl dark:shadow-white/15",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            {message.image && (
              <img
                src={message.image}
                alt="Uploaded image"
                className="rounded-lg border h-1/4 w-1/4"
              />
            )}

            {message.content && (
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            )}
          </Card>

          {/* Copy button - shows on hover */}
          <Button
            variant="secondary"
            size="sm"
            className={cn(
              "absolute -top-2 -right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
              "bg-background border shadow-sm hover:bg-muted"
            )}
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="/user-avatar.png" alt="You" />
          <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-red-600">
            <User className="h-4 w-4 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
