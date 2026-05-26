import { PageHeader } from "@/shared/ui/page-header";
import { PurchaseBuilder } from "@/modules/purchases/components/purchase-builder";

export default function NewPurchasePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nueva compra"
        description="Agrega líneas dinámicamente — totales en tiempo real"
      />
      <PurchaseBuilder />
    </div>
  );
}
