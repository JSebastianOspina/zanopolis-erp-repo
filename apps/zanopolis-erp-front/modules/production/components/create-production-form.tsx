"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EntitySearch } from "@/shared/ui/entity-search";
import { useRecipes } from "@/modules/recipes/hooks/use-recipes";
import { useCreateProductionOrder } from "../hooks/use-production";

export function CreateProductionForm() {
  const { data: recipes } = useRecipes();
  const createOrder = useCreateProductionOrder();
  const [recipeId, setRecipeId] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const recipeOptions =
    recipes?.data.map((r) => ({
      id: r.id,
      label: r.attributes.name,
      description: `Stock: ${r.attributes.finishedStock ?? 0}`,
    })) ?? [];

  const selectedRecipe = recipes?.data.find((r) => r.id === recipeId);

  const previewItems = selectedRecipe?.attributes.items ?? [];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-base">Nueva orden de producción</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Receta</Label>
          <EntitySearch
            options={recipeOptions}
            value={recipeId}
            onChange={setRecipeId}
            placeholder="Seleccionar receta"
          />
        </div>
        <div className="space-y-2">
          <Label>Cantidad a producir</Label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          />
        </div>
        <div className="space-y-2">
          <Label>Notas</Label>
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {previewItems.length > 0 && (
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="mb-2 text-sm font-medium">Preview consumo ingredientes</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {previewItems.map((item, i) => (
                <li key={i}>
                  {item.name}: {(item.quantity * quantity).toFixed(2)} unidades
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          disabled={!recipeId || createOrder.isPending}
          onClick={() =>
            recipeId &&
            createOrder.mutate({
              recipeId,
              quantity,
              notes: notes || undefined,
              scheduledDate: new Date().toISOString(),
            })
          }
        >
          Crear orden
        </Button>
      </CardContent>
    </Card>
  );
}
