"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/ui/data-table";
import { StatusBadge, getStockStatus } from "@/shared/ui/status-badge";
import { formatCurrency, formatNumber } from "@/shared/utils/format";
import type { ApiResource } from "@/shared/types/api.types";
import type { IngredientAttributes } from "@/infrastructure/api/mocks/ingredients.mock";
import { useRouter } from "next/navigation";

const columns: ColumnDef<ApiResource<IngredientAttributes>>[] = [
  {
    accessorKey: "attributes.name",
    header: "Ingrediente",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.attributes.name}</span>
    ),
  },
  {
    id: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const { currentStock = 0, unit } = row.original.attributes;
      return (
        <span>
          {formatNumber(currentStock)} {unit}
        </span>
      );
    },
  },
  {
    accessorKey: "attributes.unit",
    header: "Unidad",
  },
  {
    id: "cost",
    header: "Costo promedio",
    cell: ({ row }) =>
      formatCurrency(row.original.attributes.averageCostPerUnit ?? 0),
  },
  {
    id: "minimum",
    header: "Stock mínimo",
    cell: ({ row }) => formatNumber(row.original.attributes.minimumStock ?? 0),
  },
  {
    id: "status",
    header: "Estado",
    cell: ({ row }) => {
      const { currentStock = 0, minimumStock = 0 } = row.original.attributes;
      return <StatusBadge variant={getStockStatus(currentStock, minimumStock)} />;
    },
  },
];

interface IngredientsTableProps {
  data: ApiResource<IngredientAttributes>[];
  loading?: boolean;
}

export function IngredientsTable({ data, loading }: IngredientsTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      searchKey="attributes.name"
      searchPlaceholder="Buscar ingrediente..."
      emptyTitle="Sin ingredientes"
      emptyDescription="Agrega tu primer ingrediente al inventario"
      onRowClick={(row) => router.push(`/ingredients/${row.id}`)}
    />
  );
}
