"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/shared/ui/currency-input";
import { formatCurrency } from "@/shared/utils/format";
import type { RecipeAttributes } from "@/infrastructure/api/mocks/recipes.mock";
import { IngredientComposer } from "./ingredient-composer";
import { ChevronDown, ChevronRight, Copy } from "lucide-react";
import { useDuplicateRecipe, useUpdateRecipe } from "../hooks/use-recipes";

interface RecipeStudioProps {
  id: string;
  initial: RecipeAttributes;
}

export function RecipeStudio({ id, initial }: RecipeStudioProps) {
  const [recipe, setRecipe] = useState(initial);
  const [expandedSub, setExpandedSub] = useState<Record<string, boolean>>({});
  const updateRecipe = useUpdateRecipe();
  const duplicateRecipe = useDuplicateRecipe();

  const costs = useMemo(() => {
    const ingredientsCost = (recipe.items ?? []).reduce(
      (sum, item) => sum + (item.unitCost ?? 0) * item.quantity,
      0
    );
    const totalCost = ingredientsCost + (recipe.laborCost ?? 0);
    const margin = recipe.marginPercentage ?? 0;
    const suggestedPrice =
      recipe.customSalePrice ??
      Math.round(totalCost * (1 + margin / 100));
    const profit = suggestedPrice - totalCost;
    return { ingredientsCost, totalCost, suggestedPrice, profit, margin };
  }, [recipe]);

  const subRecipes = (recipe.items ?? []).filter((i) => i.type === "RECIPE");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-base">Recipe Studio</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Nombre</Label>
              <Input
                value={recipe.name}
                onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Costo mano de obra</Label>
              <CurrencyInput
                value={recipe.laborCost ?? 0}
                onChange={(v) => setRecipe({ ...recipe, laborCost: v })}
              />
            </div>
            <div className="space-y-2">
              <Label>Margen objetivo (%)</Label>
              <Input
                type="number"
                value={recipe.marginPercentage ?? 0}
                onChange={(e) =>
                  setRecipe({ ...recipe, marginPercentage: Number(e.target.value) })
                }
              />
            </div>
          </CardContent>
        </Card>

        <IngredientComposer
          items={recipe.items ?? []}
          onChange={(items) => setRecipe({ ...recipe, items })}
        />

        {subRecipes.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-base">Subrecetas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {subRecipes.map((sub) => (
                <div key={sub.referenceId} className="rounded-lg border">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 p-3 text-left text-sm font-medium"
                    onClick={() =>
                      setExpandedSub((s) => ({
                        ...s,
                        [sub.referenceId]: !s[sub.referenceId],
                      }))
                    }
                  >
                    {expandedSub[sub.referenceId] ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                    {sub.name} × {sub.quantity}
                  </button>
                  {expandedSub[sub.referenceId] && (
                    <div className="border-t px-3 py-2 text-xs text-muted-foreground">
                      Componentes de subreceta referenciada
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Button
            onClick={() => updateRecipe.mutate({ id, data: recipe })}
            disabled={updateRecipe.isPending}
          >
            Guardar cambios
          </Button>
          <Button
            variant="outline"
            onClick={() => duplicateRecipe.mutate(id)}
            disabled={duplicateRecipe.isPending}
          >
            <Copy className="mr-2 size-4" />
            Duplicar
          </Button>
        </div>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-base">Cost Engine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CostRow label="Costo ingredientes" value={formatCurrency(costs.ingredientsCost)} />
            <CostRow label="Mano de obra" value={formatCurrency(recipe.laborCost ?? 0)} />
            <CostRow label="Costo total" value={formatCurrency(costs.totalCost)} highlight />
            <CostRow label="Precio sugerido" value={formatCurrency(costs.suggestedPrice)} highlight />
            <CostRow
              label="Utilidad esperada"
              value={formatCurrency(costs.profit)}
              positive={costs.profit > 0}
            />
            <CostRow label="Margen" value={`${costs.margin}%`} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CostRow({
  label,
  value,
  highlight,
  positive,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={
          highlight
            ? "font-semibold"
            : positive !== undefined
              ? positive
                ? "text-emerald-600 font-medium"
                : "text-destructive font-medium"
              : "text-sm font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}
