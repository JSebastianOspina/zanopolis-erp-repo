"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { DataTable } from "@/shared/ui/data-table";
import { formatCurrency, formatDateTime } from "@/shared/utils/format";
import { useSales } from "@/modules/sales/hooks/use-sales";
import type { ApiResource } from "@/shared/types/api.types";
import type { SaleAttributes } from "@/infrastructure/api/mocks/sales.mock";
import { Plus } from "lucide-react";

const columns: ColumnDef<ApiResource<SaleAttributes>>[] = [
  {
    id: "date",
    header: "Fecha",
    cell: ({ row }) => formatDateTime(row.original.attributes.saleDate),
  },
  {
    id: "client",
    header: "Cliente",
    cell: ({ row }) => row.original.attributes.clientName ?? "Mostrador",
  },
  {
    accessorKey: "attributes.paymentMethod",
    header: "Pago",
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => formatCurrency(row.original.attributes.totalAmount),
  },
  {
    id: "profit",
    header: "Utilidad",
    cell: ({ row }) => formatCurrency(row.original.attributes.profit ?? 0),
  },
];

export default function SalesPage() {
  const { data, isLoading } = useSales();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ventas"
        description="Historial de ventas registradas"
        actions={
          <Button size="sm" asChild>
            <Link href="/sales/new">
              <Plus className="mr-2 size-4" />
              Nueva venta
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} />
    </div>
  );
}
