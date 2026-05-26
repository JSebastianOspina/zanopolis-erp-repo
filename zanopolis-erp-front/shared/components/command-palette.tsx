"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { commandActions, mainNavigation } from "@/shared/constants/navigation";
import { useUIStore } from "@/shared/stores/ui.store";

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const navigate = (href: string) => {
    setCommandPaletteOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Buscar módulos, acciones..." />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>
        <CommandGroup heading="Acciones rápidas">
          {commandActions.map((action) => (
            <CommandItem
              key={action.href}
              value={[action.label, ...action.keywords].join(" ")}
              onSelect={() => navigate(action.href)}
            >
              {action.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navegación">
          {mainNavigation.map((item) => (
            <CommandItem
              key={item.href}
              value={item.title}
              onSelect={() => navigate(item.href)}
            >
              <item.icon className="mr-2 size-4" />
              {item.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
