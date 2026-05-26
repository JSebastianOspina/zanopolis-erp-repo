import { PageHeader } from "@/shared/ui/page-header";
import { DashboardView } from "@/modules/dashboard/components/dashboard-view";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visión operacional del día — ventas, producción e inventario"
      />
      <DashboardView />
    </div>
  );
}
