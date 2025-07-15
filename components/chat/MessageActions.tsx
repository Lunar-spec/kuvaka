"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Share,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useChatStore } from "@/stores/useChatStore";
import type { Message } from "@/types/chat";

interface MessageActionsProps {
  message: Message;
  chatroomId: string;
}

export function MessageActions({ message, chatroomId }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const { showSuccess } = useToast();
  const { simulateAIResponse } = useChatStore();

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

  const handleRegenerate = () => {
    if (message.sender === "ai") {
      simulateAIResponse(chatroomId);
      showSuccess("Regenerating...", "Asking Gemini to provide a new response");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Gemini Chat Message",
          text: message.content,
        });
      } catch (error) {
        // Fallback to copy if sharing fails
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleFeedback = (type: "like" | "dislike") => {
    const action = type === "like" ? "liked" : "disliked";
    showSuccess("Feedback sent", `You ${action} this message`);
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Quick copy button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handleCopy}
      >
        <Copy className="h-3 w-3" />
      </Button>

      {/* More actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied!" : "Copy message"}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleShare}>
            <Share className="mr-2 h-4 w-4" />
            Share message
          </DropdownMenuItem>

          {message.sender === "ai" && (
            <>
              <DropdownMenuItem onClick={handleRegenerate}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate response
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleFeedback("like")}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                Good response
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleFeedback("dislike")}>
                <ThumbsDown className="mr-2 h-4 w-4" />
                Bad response
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
