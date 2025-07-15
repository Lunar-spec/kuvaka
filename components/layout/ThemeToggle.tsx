"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      {theme === "dark" ? (
        <Button
          variant={"ghost"}
          size="icon"
          className="cursor-pointer"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          variant={"ghost"}
          size="icon"
          className="cursor-pointer"
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
