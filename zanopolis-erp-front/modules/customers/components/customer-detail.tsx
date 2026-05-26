"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/shared/utils/format";
import type { ClientAttributes } from "@/infrastructure/api/mocks/clients.mock";
import { useSales } from "@/modules/sales/hooks/use-sales";

interface CustomerDetailProps {
  id: string;
  attributes: ClientAttributes;
}

export function CustomerDetail({ id, attributes }: CustomerDetailProps) {
  const { data: sales } = useSales();
  const customerSales =
    sales?.data.filter((s) => s.attributes.clientId === id) ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-base">Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Teléfono" value={attributes.phone ?? "—"} />
          <Row label="Dirección" value={attributes.address ?? "—"} />
          <Row label="Total comprado" value={formatCurrency(attributes.totalPurchased ?? 0)} />
          <Row
            label="Última compra"
            value={
              attributes.lastPurchaseDate
                ? formatDate(attributes.lastPurchaseDate)
                : "—"
            }
          />
          {attributes.notes && (
            <Row label="Observaciones" value={attributes.notes} />
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-base">Historial de compras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {customerSales.length ? (
            customerSales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between rounded-lg border p-3 text-sm"
              >
                <span>{formatDate(sale.attributes.saleDate)}</span>
                <span className="font-medium">
                  {formatCurrency(sale.attributes.totalAmount)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Sin compras registradas</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
