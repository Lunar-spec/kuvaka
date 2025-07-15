import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UIState } from "@/types/ui";

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      darkMode: false,
      sidebarOpen: true,
      loading: {
        messages: false,
        chatrooms: false,
        auth: false,
      },

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setLoading: (key, value) =>
        set((state) => ({
          loading: { ...state.loading, [key]: value },
        })),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        darkMode: state.darkMode,
      }),
    }
  )
);
