"use client";

import { useRouter } from "next/navigation";
import { useChatStore } from "@/stores/useChatStore";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus } from "lucide-react";
import { useState } from "react";
import { CreateChatroomDialog } from "@/components/dashboard/CreateChatroomDialog";

export default function DashboardPage() {
  const router = useRouter();
  const { chatrooms, setActiveChatroom } = useChatStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleChatroomClick = (chatroomId: string) => {
    setActiveChatroom(chatroomId);
    router.push(`/chat/${chatroomId}`);
  };

  const handleCreateChatroom = () => {
    setShowCreateDialog(true);
  };

  if (chatrooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No conversations yet</h2>
          <p className="text-muted-foreground mb-6">
            Start your first conversation with Gemini AI
          </p>
          <Button onClick={handleCreateChatroom} className="gap-2">
            <Plus className="h-4 w-4" />
            Start New Chat
          </Button>
        </div>

        <CreateChatroomDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Recent Conversations</h1>
          <p className="text-muted-foreground">
            Continue where you left off or start a new conversation
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chatrooms.slice(0, 6).map((chatroom) => (
            <div
              key={chatroom.id}
              className="p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => handleChatroomClick(chatroom.id)}
            >
              <h3 className="font-medium mb-2 truncate">{chatroom.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {chatroom.messages.length} messages
              </p>
              {chatroom.lastMessage && (
                <p className="text-xs text-muted-foreground truncate">
                  {chatroom.lastMessage.content.substring(0, 50)}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={handleCreateChatroom}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Chat
          </Button>
        </div>
      </div>

      <CreateChatroomDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
