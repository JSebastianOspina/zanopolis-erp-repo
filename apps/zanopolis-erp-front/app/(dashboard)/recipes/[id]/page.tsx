"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { RecipeStudio } from "@/modules/recipes/components/recipe-studio";
import { useRecipe } from "@/modules/recipes/hooks/use-recipes";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useRecipe(id);

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!data) return <p>Receta no encontrada</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={data.data.attributes.name}
        description="Editor de costos en tiempo real"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/recipes">
              <ArrowLeft className="mr-2 size-4" />
              Volver
            </Link>
          </Button>
        }
      />
      <RecipeStudio id={id} initial={data.data.attributes} />
    </div>
  );
}
