import { PageHeader } from "@/shared/ui/page-header";
import { PosView } from "@/modules/sales/components/pos-view";

export default function NewSalePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Punto de venta"
        description="Velocidad extrema — búsqueda, carrito y totales en vivo"
      />
      <PosView />
    </div>
  );
}
