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
        <AvatarFallback>
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col max-w-[80%] sm:max-w-[70%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-muted-foreground">
            Gemini
          </span>
          <span className="text-xs text-muted-foreground">is typing...</span>
        </div>

        <Card className="bg-muted p-3 w-fit">
          <div className="flex items-center gap-1">
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
        "h-2 w-2 rounded-full bg-muted-foreground/60",
        "animate-pulse"
      )}
      style={{
        animationDelay: delay,
        animationDuration: "1.4s",
        animationIterationCount: "infinite",
      }}
    />
  );
}
