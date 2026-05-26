"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { IngredientDetail } from "@/modules/ingredients/components/ingredient-detail";
import { useIngredient } from "@/modules/ingredients/hooks/use-ingredients";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function IngredientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useIngredient(id);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!data) {
    return <p>Ingrediente no encontrado</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={data.data.attributes.name}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/ingredients">
              <ArrowLeft className="mr-2 size-4" />
              Volver
            </Link>
          </Button>
        }
      />
      <IngredientDetail id={id} attributes={data.data.attributes} />
    </div>
  );
}
