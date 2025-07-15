"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image as ImageIcon, X } from "lucide-react";
import { useChatStore } from "@/stores/useChatStore";
import { useToast } from "@/hooks/useToast";
import { ImageUpload } from "./ImageUpload";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  chatroomId: string;
}

export function MessageInput({ chatroomId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { sendMessage, isTyping } = useChatStore();
  const { showSuccess, showError } = useToast();

  const handleSend = async () => {
    if ((!message.trim() && !selectedImage) || isTyping) return;

    const messageContent = message.trim();
    const imageData = selectedImage ?? undefined;

    // Clear input immediately
    setMessage("");
    setSelectedImage(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      sendMessage(chatroomId, messageContent, imageData);
      showSuccess("Message sent", "Your message has been sent to Gemini");
    } catch (error) {
      showError("Failed to send", "Please try again");
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (imageData: string) => {
    setSelectedImage(imageData);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Invalid file type", "Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showError("File too large", "Please select an image under 5MB");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleImageSelect(result);
      setUploading(false);
    };
    reader.onerror = () => {
      showError("Upload failed", "Failed to process image");
      setUploading(false);
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Auto-resize textarea
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);

    // Auto-resize
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const canSend = (message.trim() || selectedImage) && !isTyping && !uploading;

  return (
    <div className="space-y-3">
      {/* Image preview */}
      {selectedImage && (
        <div className="relative inline-block">
          <img
            src={selectedImage}
            alt="Selected image"
            className="max-w-48 max-h-32 rounded-lg border object-cover"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            onClick={handleImageRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isTyping ? "Gemini is typing..." : "Type your message..."
            }
            disabled={isTyping || uploading}
            className={cn(
              "min-h-[44px] max-h-[120px] resize-none pr-12",
              "focus-visible:ring-1 focus-visible:ring-ring"
            )}
            rows={1}
          />

          {/* Image upload button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0"
            onClick={handleImageUpload}
            disabled={isTyping || uploading}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!canSend}
          className="h-11 w-11 p-0 bg-gradient-to-br from-blue-500 to-purple-500 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
