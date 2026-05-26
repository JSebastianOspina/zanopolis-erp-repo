import { PageHeader } from "@/shared/ui/page-header";
import { FinanceView } from "@/modules/finance/components/finance-view";

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Finanzas"
        description="Claridad financiera — ingresos, egresos y utilidad"
      />
      <FinanceView />
    </div>
  );
}
