"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EntitySearch } from "@/shared/ui/entity-search";
import { CurrencyInput } from "@/shared/ui/currency-input";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/shared/utils/format";
import { Plus, Trash2 } from "lucide-react";
import { useCreatePurchase, useSuppliers } from "../hooks/use-purchases";
import { useIngredients } from "@/modules/ingredients/hooks/use-ingredients";
import { useRouter } from "next/navigation";

interface PurchaseLine {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  totalCost: number;
}

export function PurchaseBuilder() {
  const router = useRouter();
  const { data: suppliers } = useSuppliers();
  const { data: ingredients } = useIngredients();
  const createPurchase = useCreatePurchase();

  const [supplierId, setSupplierId] = useState<string>();
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "TRANSFER">("TRANSFER");
  const [lines, setLines] = useState<PurchaseLine[]>([
    { ingredientId: "", ingredientName: "", quantity: 1, totalCost: 0 },
  ]);

  const total = lines.reduce((sum, l) => sum + l.totalCost, 0);

  const supplierOptions =
    suppliers?.data.map((s) => ({
      id: s.id,
      label: s.attributes.name,
    })) ?? [];

  const ingredientOptions =
    ingredients?.data.map((i) => ({
      id: i.id,
      label: i.attributes.name,
      description: `${i.attributes.currentStock} ${i.attributes.unit}`,
    })) ?? [];

  const addLine = () =>
    setLines([...lines, { ingredientId: "", ingredientName: "", quantity: 1, totalCost: 0 }]);

  const updateLine = (index: number, patch: Partial<PurchaseLine>) => {
    const next = [...lines];
    next[index] = { ...next[index], ...patch };
    setLines(next);
  };

  const removeLine = (index: number) => setLines(lines.filter((_, i) => i !== index));

  const submit = () => {
    if (!supplierId) return;
    createPurchase.mutate(
      {
        supplierId,
        paymentMethod,
        items: lines
          .filter((l) => l.ingredientId)
          .map((l) => ({
            ingredientId: l.ingredientId,
            quantity: l.quantity,
            totalCost: l.totalCost,
          })),
      },
      { onSuccess: () => router.push("/purchases") }
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-base">Purchase Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Proveedor</Label>
              <EntitySearch
                options={supplierOptions}
                value={supplierId}
                onChange={setSupplierId}
                placeholder="Seleccionar proveedor"
              />
            </div>
            <div className="space-y-2">
              <Label>Método de pago</Label>
              <Select
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as "CASH" | "TRANSFER")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRANSFER">Transferencia</SelectItem>
                  <SelectItem value="CASH">Efectivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {lines.map((line, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[2fr_1fr_1fr_auto]"
              >
                <EntitySearch
                  options={ingredientOptions}
                  value={line.ingredientId || undefined}
                  onChange={(id) => {
                    const ing = ingredientOptions.find((o) => o.id === id);
                    updateLine(index, {
                      ingredientId: id ?? "",
                      ingredientName: ing?.label ?? "",
                    });
                  }}
                  placeholder="Ingrediente"
                />
                <Input
                  type="number"
                  min={0}
                  placeholder="Cantidad"
                  value={line.quantity}
                  onChange={(e) =>
                    updateLine(index, { quantity: Number(e.target.value) || 0 })
                  }
                />
                <CurrencyInput
                  value={line.totalCost}
                  onChange={(v) => updateLine(index, { totalCost: v })}
                />
                <Button variant="ghost" size="icon-sm" onClick={() => removeLine(index)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addLine}>
              <Plus className="mr-2 size-4" />
              Agregar línea
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm lg:sticky lg:top-6 lg:self-start">
        <CardHeader>
          <CardTitle className="font-heading text-base">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Líneas</span>
            <span>{lines.filter((l) => l.ingredientId).length}</span>
          </div>
          <div className="flex justify-between border-t pt-4">
            <span className="font-medium">Total</span>
            <span className="text-xl font-semibold">{formatCurrency(total)}</span>
          </div>
          <Button className="w-full" onClick={submit} disabled={createPurchase.isPending}>
            Registrar compra
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
