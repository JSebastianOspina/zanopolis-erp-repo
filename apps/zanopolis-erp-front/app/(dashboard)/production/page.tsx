"use client";

import { PageHeader } from "@/shared/ui/page-header";
import { ProductionQueue } from "@/modules/production/components/production-queue";
import { CreateProductionForm } from "@/modules/production/components/create-production-form";
import { useProductionOrders } from "@/modules/production/hooks/use-production";

export default function ProductionPage() {
  const { data, isLoading } = useProductionOrders();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Producción"
        description="Cola operacional — convierte recetas en ejecución real"
      />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <CreateProductionForm />
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando cola...</p>
        ) : (
          <ProductionQueue orders={data?.data ?? []} />
        )}
      </div>
    </div>
  );
}
