"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useUIStore } from "@/stores/useUIStore";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, LogOut, User } from "lucide-react";
import { ModeToggle } from "./ThemeToggle";

export function Header() {
  const { user, logout } = useAuthStore();
  const { darkMode, sidebarOpen, toggleDarkMode, setSidebarOpen } =
    useUIStore();

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                G
              </span>
            </div>
            <h1 className="text-xl font-semibold">Gemini Chat</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {user && (
            <>
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {user.countryCode} {user.phone}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-9 h-9 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
