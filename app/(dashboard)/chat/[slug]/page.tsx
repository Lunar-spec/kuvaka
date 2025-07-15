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
  const { chatrooms, setActiveChatroom, getActiveChatroom } = useChatStore();

  const chatroomId = params.slug as string;

  useEffect(() => {
    if (chatroomId) {
      const chatroom = chatrooms.find((room) => room.id === chatroomId);
      if (chatroom) {
        setActiveChatroom(chatroomId);
      } else {
        setTimeout(() => {
          // Redirect to dashboard if chatroom not found after delay
          router.push("/dashboard");
        }, 3000);
      }
    }
  }, [chatroomId, chatrooms, setActiveChatroom, router]);

  const currentChatroom = getActiveChatroom();

  if (!currentChatroom) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="text-center p-8 rounded-2xl shadow-xl">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-red-400 mx-auto mb-4 rounded-full">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">
            Chatroom not found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
            The chatroom you're looking for doesn't exist or has been deleted.
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100vh]">
      <ChatInterface chatroomId={chatroomId} />
    </div>
  );
}
