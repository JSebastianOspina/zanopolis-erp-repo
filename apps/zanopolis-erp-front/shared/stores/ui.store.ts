import { create } from "zustand";

interface DrawerState {
  id: string | null;
  data?: unknown;
}

interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  activeDrawer: DrawerState;
  activeModal: DrawerState;
  tableFilters: Record<string, Record<string, unknown>>;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  openDrawer: (id: string, data?: unknown) => void;
  closeDrawer: () => void;
  openModal: (id: string, data?: unknown) => void;
  closeModal: () => void;
  setTableFilter: (tableId: string, filters: Record<string, unknown>) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  activeDrawer: { id: null },
  activeModal: { id: null },
  tableFilters: {},
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  openDrawer: (id, data) => set({ activeDrawer: { id, data } }),
  closeDrawer: () => set({ activeDrawer: { id: null } }),
  openModal: (id, data) => set({ activeModal: { id, data } }),
  closeModal: () => set({ activeModal: { id: null } }),
  setTableFilter: (tableId, filters) =>
    set((s) => ({
      tableFilters: { ...s.tableFilters, [tableId]: filters },
    })),
}));
