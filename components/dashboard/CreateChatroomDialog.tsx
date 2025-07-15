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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createChatroomSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title is too long"),
});

type CreateChatroomForm = z.infer<typeof createChatroomSchema>;

interface CreateChatroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateChatroomDialog({
  open,
  onOpenChange,
}: CreateChatroomDialogProps) {
  const router = useRouter();
  const { createChatroom, setActiveChatroom } = useChatStore();
  const { showError, showInfo, showSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateChatroomForm>({
    resolver: zodResolver(createChatroomSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: CreateChatroomForm) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const chatroomId = createChatroom(data.title);
      setActiveChatroom(chatroomId);

      showSuccess("Chatroom Created", `"${data.title}" has been created.`);

      onOpenChange(false);
      form.reset();
      router.push(`/chat/${chatroomId}`);
    } catch (error) {
      console.error("Error creating chatroom:", error);
      showError("Failed to create chatroom", "Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Chat Title</Label>
            <Input
              id="title"
              placeholder="Enter chat title..."
              {...form.register("title")}
              disabled={isLoading}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Chat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
