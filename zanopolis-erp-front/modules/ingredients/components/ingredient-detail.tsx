"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, getStockStatus } from "@/shared/ui/status-badge";
import { formatCurrency, formatNumber } from "@/shared/utils/format";
import type { IngredientAttributes } from "@/infrastructure/api/mocks/ingredients.mock";

interface IngredientDetailProps {
  id: string;
  attributes: IngredientAttributes;
}

export function IngredientDetail({ id, attributes }: IngredientDetailProps) {
  const status = getStockStatus(
    attributes.currentStock ?? 0,
    attributes.minimumStock ?? 0
  );

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="movements">Movimientos</TabsTrigger>
        <TabsTrigger value="waste">Merma</TabsTrigger>
        <TabsTrigger value="costs">Historial costos</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{attributes.name}</CardTitle>
            <StatusBadge variant={status} />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Stock actual</p>
              <p className="text-lg font-semibold">
                {formatNumber(attributes.currentStock ?? 0)} {attributes.unit}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Stock mínimo</p>
              <p className="text-lg font-semibold">
                {formatNumber(attributes.minimumStock ?? 0)} {attributes.unit}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Costo promedio</p>
              <p className="text-lg font-semibold">
                {formatCurrency(attributes.averageCostPerUnit ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Categoría</p>
              <p className="text-lg font-semibold">{attributes.category}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="movements">
        <Card className="shadow-sm">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Historial de movimientos para {id} — conectado vía API
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="waste">
        <Card className="shadow-sm">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Registros de merma del ingrediente
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="costs">
        <Card className="shadow-sm">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Evolución de costos promedio
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
