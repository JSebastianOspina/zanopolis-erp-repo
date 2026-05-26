"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/shared/utils/format";
import type { RecipeItemAttributes } from "@/infrastructure/api/mocks/recipes.mock";
import { Plus, Trash2 } from "lucide-react";

interface IngredientComposerProps {
  items: RecipeItemAttributes[];
  onChange: (items: RecipeItemAttributes[]) => void;
}

export function IngredientComposer({ items, onChange }: IngredientComposerProps) {
  const addRow = () => {
    onChange([
      ...items,
      {
        type: "INGREDIENT",
        referenceId: "",
        quantity: 1,
        name: "Nuevo ingrediente",
        unitCost: 0,
      },
    ]);
  };

  const updateRow = (index: number, patch: Partial<RecipeItemAttributes>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const removeRow = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading text-base">Ingredient Composer</CardTitle>
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus className="mr-2 size-4" />
          Agregar línea
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingrediente</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Costo unit.</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={item.name ?? ""}
                    onChange={(e) => updateRow(index, { name: e.target.value })}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.quantity}
                    onChange={(e) =>
                      updateRow(index, { quantity: Number(e.target.value) || 0 })
                    }
                    className="h-8 w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    value={item.unitCost ?? 0}
                    onChange={(e) =>
                      updateRow(index, { unitCost: Number(e.target.value) || 0 })
                    }
                    className="h-8 w-24"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency((item.unitCost ?? 0) * item.quantity)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeRow(index)}
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
