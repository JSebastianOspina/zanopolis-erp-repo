"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { DataTable } from "@/shared/ui/data-table";
import { formatCurrency, formatDate } from "@/shared/utils/format";
import { usePurchases } from "@/modules/purchases/hooks/use-purchases";
import type { ApiResource } from "@/shared/types/api.types";
import type { PurchaseAttributes } from "@/infrastructure/api/mocks/purchases.mock";
import { Plus } from "lucide-react";

const columns: ColumnDef<ApiResource<PurchaseAttributes>>[] = [
  {
    id: "date",
    header: "Fecha",
    cell: ({ row }) => formatDate(row.original.attributes.purchaseDate),
  },
  {
    accessorKey: "attributes.supplierId",
    header: "Proveedor",
  },
  {
    accessorKey: "attributes.paymentMethod",
    header: "Pago",
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => formatCurrency(row.original.attributes.totalCost),
  },
];

export default function PurchasesPage() {
  const { data, isLoading } = usePurchases();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compras"
        description="Registro rápido de compras a proveedores"
        actions={
          <Button size="sm" asChild>
            <Link href="/purchases/new">
              <Plus className="mr-2 size-4" />
              Nueva compra
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        emptyTitle="Sin compras registradas"
      />
    </div>
  );
}
