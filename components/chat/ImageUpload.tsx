"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  onImageRemove?: () => void;
  selectedImage?: string | null;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  selectedImage,
  disabled = false,
  className,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { showError } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      showError("Invalid file type", "Please select an image file");
      return false;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showError("File too large", "Please select an image under 5MB");
      return false;
    }

    return true;
  };

  const processFile = useCallback(
    async (file: File) => {
      if (!validateFile(file)) return;

      setUploading(true);

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onImageSelect(result);
          setUploading(false);
        };
        reader.onerror = () => {
          showError("Upload failed", "Failed to process image");
          setUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        showError("Upload failed", "Failed to process image");
        setUploading(false);
      }
    },
    [onImageSelect, showError]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || uploading) return;

      const files = e.dataTransfer.files;
      if (files?.[0]) {
        processFile(files[0]);
      }
    },
    [disabled, uploading, processFile]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  if (selectedImage) {
    return (
      <Card className={cn("relative inline-block", className)}>
        <img
          src={selectedImage}
          alt="Selected image"
          className="max-w-full max-h-64 rounded-lg object-cover"
        />
        {onImageRemove && (
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            onClick={onImageRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "border-2 border-dashed transition-colors",
        dragActive && "border-primary bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <label
        className={cn(
          "flex flex-col items-center justify-center p-6 cursor-pointer",
          disabled && "cursor-not-allowed"
        )}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2 text-center">
          {uploading ? (
            <div className="animate-spin">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          )}

          <div>
            <p className="text-sm font-medium">
              {uploading
                ? "Uploading..."
                : "Drop an image here or click to select"}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      </label>
    </Card>
  );
}
