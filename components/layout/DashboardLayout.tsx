"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUIStore } from "@/stores/useUIStore";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuthStore();
  const { darkMode, sidebarOpen } = useUIStore();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user?.isAuthenticated) {
      router.push("/login");
    }
  }, [user, router]);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  if (!user?.isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main content area */}
        <main
          className={cn(
            "flex-1 overflow-hidden transition-all duration-300",
            sidebarOpen ? "md:ml-72" : "md:ml-0"
          )}
        >
          {children}
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: "toast",
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        }}
      />
    </div>
  );
}
