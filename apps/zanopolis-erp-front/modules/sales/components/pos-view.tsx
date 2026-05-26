"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EntitySearch } from "@/shared/ui/entity-search";
import { QuantityInput } from "@/shared/ui/quantity-input";
import { CurrencyInput } from "@/shared/ui/currency-input";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { formatCurrency } from "@/shared/utils/format";
import { useRecipes } from "@/modules/recipes/hooks/use-recipes";
import { useCustomers } from "@/modules/customers/hooks/use-customers";
import { useCreateSale } from "../hooks/use-sales";
import { Search, ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItem {
  recipeId: string;
  recipeName: string;
  quantity: number;
  customSalePrice: number;
  costSnapshot: number;
}

export function PosView() {
  const router = useRouter();
  const { data: recipes } = useRecipes();
  const { data: clients } = useCustomers();
  const createSale = useCreateSale();

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [clientId, setClientId] = useState<string>();
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "TRANSFER">("CASH");
  const [showProductionModal, setShowProductionModal] = useState(false);

  const filteredRecipes =
    recipes?.data.filter((r) =>
      r.attributes.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  const clientOptions =
    clients?.data.map((c) => ({
      id: c.id,
      label: c.attributes.name,
      description: c.attributes.phone,
    })) ?? [];

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, i) => s + i.customSalePrice * i.quantity, 0);
    const cost = cart.reduce((s, i) => s + i.costSnapshot * i.quantity, 0);
    return { subtotal, cost, profit: subtotal - cost };
  }, [cart]);

  const addToCart = (recipeId: string) => {
    const recipe = recipes?.data.find((r) => r.id === recipeId);
    if (!recipe) return;
    const existing = cart.find((c) => c.recipeId === recipeId);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.recipeId === recipeId ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([
        ...cart,
        {
          recipeId,
          recipeName: recipe.attributes.name,
          quantity: 1,
          customSalePrice:
            recipe.attributes.customSalePrice ??
            recipe.attributes.suggestedPrice ??
            0,
          costSnapshot: recipe.attributes.unitCost ?? recipe.attributes.totalCost ?? 0,
        },
      ]);
    }
  };

  const submitSale = (createProductionIfNeeded = false) => {
    createSale.mutate(
      {
        data: {
          clientId,
          paymentMethod,
          items: cart.map((c) => ({
            recipeId: c.recipeId,
            quantity: c.quantity,
            customSalePrice: c.customSalePrice,
            costSnapshot: c.costSnapshot,
          })),
        },
        createProductionIfNeeded,
      },
      {
        onSuccess: () => {
          setShowProductionModal(false);
          router.push("/sales");
        },
      }
    );
  };

  const hasLowStock = cart.some((item) => {
    const recipe = recipes?.data.find((r) => r.id === item.recipeId);
    return (recipe?.attributes.finishedStock ?? 0) < item.quantity;
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar producto..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              onClick={() => addToCart(recipe.id)}
              className="rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <p className="font-medium">{recipe.attributes.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Stock: {recipe.attributes.finishedStock ?? 0}
              </p>
              <p className="mt-2 text-sm font-semibold text-primary">
                {formatCurrency(
                  recipe.attributes.customSalePrice ??
                    recipe.attributes.suggestedPrice ??
                    0
                )}
              </p>
            </button>
          ))}
        </div>
      </div>

      <Card className="shadow-sm lg:sticky lg:top-6 lg:self-start">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-base">
            <ShoppingCart className="size-4" />
            Carrito
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Cliente (opcional)</Label>
            <EntitySearch
              options={clientOptions}
              value={clientId}
              onChange={setClientId}
              placeholder="Seleccionar cliente"
            />
          </div>
          <div className="space-y-2">
            <Label>Pago</Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as "CASH" | "TRANSFER")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Efectivo</SelectItem>
                <SelectItem value="TRANSFER">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="max-h-64 space-y-3 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Carrito vacío
              </p>
            ) : (
              cart.map((item, index) => (
                <div key={item.recipeId} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.recipeName}</p>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setCart(cart.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <QuantityInput
                    value={item.quantity}
                    onChange={(q) =>
                      setCart(cart.map((c, i) => (i === index ? { ...c, quantity: q } : c)))
                    }
                    min={1}
                  />
                  <CurrencyInput
                    value={item.customSalePrice}
                    onChange={(p) =>
                      setCart(
                        cart.map((c, i) =>
                          i === index ? { ...c, customSalePrice: p } : c
                        )
                      )
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Costo: {formatCurrency(item.costSnapshot)} · Margen:{" "}
                    {formatCurrency(item.customSalePrice - item.costSnapshot)}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="space-y-1 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Utilidad est.</span>
              <span className="text-emerald-600">{formatCurrency(totals.profit)}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
          </div>

          <Button
            className="w-full"
            disabled={cart.length === 0 || createSale.isPending}
            onClick={() => (hasLowStock ? setShowProductionModal(true) : submitSale())}
          >
            Registrar venta
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showProductionModal}
        onOpenChange={setShowProductionModal}
        title="Stock insuficiente"
        description="¿Desea producir automáticamente los productos faltantes?"
        confirmLabel="Producir y vender"
        onConfirm={() => submitSale(true)}
      />
    </div>
  );
}
