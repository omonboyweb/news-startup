"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tr, type Script } from "@/lib/script";

const REGION_OPTIONS = [
  { value: "all", label: "Barcha hududlar" },
  { value: "Uzbekistan", label: "O'zbekiston" },
  { value: "Jahon", label: "Jahon" },
] as const;

export function RegionSelector({ script }: { script: Script }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const region = searchParams.get("region") ?? "all";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("region");
    } else {
      params.set("region", value);
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  return (
    <Select value={region} onValueChange={handleChange}>
      <SelectTrigger
        size="sm"
        aria-label="Hududni tanlash"
        className="w-[160px] shadow-none"
      >
        <Globe className="size-3.5" />
        <SelectValue placeholder="Hudud" />
      </SelectTrigger>
      <SelectContent align="end">
        {REGION_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {tr(option.label, script)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
