"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { IngredientsTable } from "@/modules/ingredients/components/ingredients-table";
import { useIngredients } from "@/modules/ingredients/hooks/use-ingredients";
import { Plus } from "lucide-react";

export default function IngredientsPage() {
  const { data, isLoading } = useIngredients();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ingredientes"
        description="Control operacional de stock y costos"
        actions={
          <Button size="sm">
            <Plus className="mr-2 size-4" />
            Nuevo ingrediente
          </Button>
        }
      />
      <IngredientsTable data={data?.data ?? []} loading={isLoading} />
    </div>
  );
}
