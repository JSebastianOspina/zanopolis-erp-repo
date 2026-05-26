"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/shared/stores/ui.store";
import { Search } from "lucide-react";

export function TopBar() {
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger />
      <Button
        variant="outline"
        className="hidden h-8 flex-1 max-w-md justify-start gap-2 text-muted-foreground sm:flex"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="size-4" />
        <span className="text-sm">Buscar...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="sm:hidden"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="size-4" />
      </Button>
    </header>
  );
}
