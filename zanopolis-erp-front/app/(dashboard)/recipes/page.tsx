"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { RecipesList } from "@/modules/recipes/components/recipes-list";
import { useRecipes } from "@/modules/recipes/hooks/use-recipes";
import { Plus } from "lucide-react";

export default function RecipesPage() {
  const { data, isLoading } = useRecipes();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recetas"
        description="Recipe Studio — construcción visual de costos productivos"
        actions={
          <Button size="sm">
            <Plus className="mr-2 size-4" />
            Nueva receta
          </Button>
        }
      />
      <RecipesList data={data?.data ?? []} loading={isLoading} />
    </div>
  );
}
