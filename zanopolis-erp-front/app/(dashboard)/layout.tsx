import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/app-sidebar";
import { CommandPalette } from "@/shared/components/command-palette";
import { TopBar } from "@/shared/components/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopBar />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
      <CommandPalette />
    </SidebarProvider>
  );
}
