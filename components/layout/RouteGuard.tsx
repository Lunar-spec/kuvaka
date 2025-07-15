"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isAuthenticated = user?.isAuthenticated === true;

  // Protected routes - require authentication
  const protectedRoutes = ["/dashboard", "/chat"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth routes - should redirect if already logged in
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    // Redirect unauthenticated users away from protected routes
    if (isProtectedRoute && !isAuthenticated) {
      router.push("/login");
      return;
    }

    // Redirect authenticated users away from auth routes
    if (isAuthRoute && isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    // Redirect root to appropriate page
    if (pathname === "/") {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, pathname, router, isProtectedRoute, isAuthRoute]);

  // Show loading or prevent flash of wrong content
  if (isProtectedRoute && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthRoute && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}
