"use client";

import { useState, useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useChatStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce the search query with 300ms delay
  const debouncedQuery = useDebounce(localQuery, 300);

  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  // Alternative approach using callback hook
  // const debouncedSearch = useDebouncedCallback((value: string) => {
  //   setSearchQuery(value)
  // }, 300)

  // useEffect(() => {
  //   debouncedSearch(localQuery)
  // }, [localQuery, debouncedSearch])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search conversations..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
