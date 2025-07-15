"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/stores/useChatStore";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DeleteChatroomDialog } from "./DeleteChatroomDialog";
import type { Chatroom } from "@/types/chat";

interface ChatroomItemProps {
  chatroom: Chatroom;
}

export function ChatroomItem({ chatroom }: ChatroomItemProps) {
  const router = useRouter();
  const { activeChatroom, setActiveChatroom } = useChatStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isActive = activeChatroom === chatroom.id;

  const handleClick = () => {
    setActiveChatroom(chatroom.id);
    router.push(`/chat/${chatroom.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Truncate message content to a reasonable length
  const truncateMessage = (message: string, maxLength: number = 25) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <>
      <div
        className={cn(
          "group relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors min-h-[60px]",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "hover:bg-sidebar-accent/50"
        )}
        onClick={handleClick}
      >
        {/* Content area - takes up available space minus button */}
        <div className="flex-1 min-w-0 pr-8">
          {/* Title and time row */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium truncate text-sm flex-1 mr-2">
              {chatroom.title}
            </h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTime(
                chatroom.lastMessage?.timestamp || chatroom.createdAt
              )}
            </span>
          </div>

          {/* Last message - with proper truncation */}
          {chatroom.lastMessage && (
            <p className="text-xs text-muted-foreground mb-1 leading-tight">
              <span className="font-medium">
                {chatroom.lastMessage.sender === "user" ? "You: " : "Gemini: "}
              </span>
              <span className="truncate">
                {truncateMessage(chatroom.lastMessage.content)}
              </span>
            </p>
          )}

          {/* Message count */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {chatroom.messages.length} messages
            </span>
          </div>
        </div>

        {/* Delete button - positioned absolutely to always be visible */}
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeleteChatroomDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        chatroom={chatroom}
      />
    </>
  );
}
