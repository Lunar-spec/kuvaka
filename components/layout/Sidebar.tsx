"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/stores/useUIStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, MessageCircle, Bot, Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { ChatroomList } from "@/components/dashboard/ChatroomList";
import { CreateChatroomDialog } from "@/components/dashboard/CreateChatroomDialog";
import { ModeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/stores";

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-[100vh] w-80 transform border-r transition-transform duration-200 ease-in-out lg:static lg:z-0 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold truncate">Gemini Chat</h2>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateDialog(true)}
                className="h-8 w-8 p-0 hover:bg-white/60 dark:hover:bg-slate-800/60"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 p-0 lg:hidden hover:bg-white/60 dark:hover:bg-slate-800/60"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size="icon" className="h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-row items-center justify-center">
                <DropdownMenuItem>
                  <ModeToggle />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"ghost"}
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 text-destructive" />
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <SearchBar />
          </div>

          {/* Chatroom List */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              <ChatroomList />
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <MessageCircle className="w-4 h-4" />
              <span>AI-powered conversations</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Create Chatroom Dialog */}
      <CreateChatroomDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
}
