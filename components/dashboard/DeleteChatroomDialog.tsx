"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/stores/useChatStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToast";
import type { Chatroom } from "@/types/chat";

interface DeleteChatroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatroom: Chatroom;
}

export function DeleteChatroomDialog({
  open,
  onOpenChange,
  chatroom,
}: DeleteChatroomDialogProps) {
  const router = useRouter();
  const { deleteChatroom, activeChatroom } = useChatStore();
  const { showError, showInfo, showSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      deleteChatroom(chatroom.id);

      showSuccess("Chatroom Deleted", `"${chatroom.title}" has been deleted.`);

      // Redirect to dashboard if deleting active chatroom
      if (activeChatroom === chatroom.id) {
        router.push("/");
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting chatroom:", error);
      showError("Failed to delete chatroom", "Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Chat</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{chatroom.title}"? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
