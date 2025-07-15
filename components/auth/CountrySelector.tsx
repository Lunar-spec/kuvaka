"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { useCountryStore } from "@/stores/useCountryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import type { Country } from "@/types/auth";

interface CountrySelectorProps {
  value?: string;
  onSelect: (country: Country) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CountrySelector({
  value,
  onSelect,
  placeholder = "Select country",
  disabled = false,
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const { countries, loading, fetchCountries, getCountryByCode } =
    useCountryStore();

  const selectedCountry = value ? getCountryByCode(value) : null;

  useEffect(() => {
    if (countries.length === 0) {
      fetchCountries();
    }
  }, [countries.length, fetchCountries]);

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedCountry ? (
            <div className="flex items-center space-x-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-sm">{selectedCountry.dialCode}</span>
              <span className="text-sm text-muted-foreground">
                {selectedCountry.name}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.dialCode}`}
                  onSelect={() => {
                    onSelect(country);
                    setOpen(false);
                  }}
                  className="flex items-center space-x-2"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm font-medium">
                    {country.dialCode}
                  </span>
                  <span className="text-sm text-muted-foreground flex-1">
                    {country.name}
                  </span>
                  <Check
                    className={`ml-auto h-4 w-4 ${
                      selectedCountry?.code === country.code
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
