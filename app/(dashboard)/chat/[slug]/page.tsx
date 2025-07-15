"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChatStore } from "@/stores/useChatStore";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { chatrooms, activeChatroom, setActiveChatroom, getActiveChatroom } =
    useChatStore();

  const chatroomId = params.slug as string;

  useEffect(() => {
    if (chatroomId) {
      const chatroom = chatrooms.find((room) => room.id === chatroomId);
      if (chatroom) {
        setActiveChatroom(chatroomId);
      } else {
        router.push("/dashboard");
      }
    }
  }, [chatroomId, chatrooms, setActiveChatroom, router]);

  const currentChatroom = getActiveChatroom();

  if (!currentChatroom) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">Chatroom not found</h2>
          <p className="text-muted-foreground mb-4">
            The chatroom you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="border-b bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold truncate">{currentChatroom.title}</h1>
            <p className="text-sm text-muted-foreground">
              {currentChatroom.messages.length} messages
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatInterface chatroomId={chatroomId} />
      </div>
    </div>
  );
}
