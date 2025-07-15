"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-in fade-in-50 slide-in-from-bottom-2">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src="/gemini-avatar.png" alt="Gemini" />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 ">
          <Bot className="h-4 w-4 text-white animate-caret-blink" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col max-w-[80%] sm:max-w-[70%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium bg-gradient-to-br from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Gemini
          </span>
          <span className="text-xs text-muted-foreground">is thinking...</span>
        </div>

        <Card className="bg-muted/40 p-4 w-fit">
          <div className="flex items-center gap-2 animate-pulse">
            <TypingDot delay="0ms" />
            <TypingDot delay="200ms" />
            <TypingDot delay="400ms" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function TypingDot({ delay }: { delay: string }) {
  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500",
        "animate-bounce"
      )}
      style={{
        animationDelay: delay,
        animationDuration: "700ms",
        animationIterationCount: "infinite",
      }}
    />
  );
}
