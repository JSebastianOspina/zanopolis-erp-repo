"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/ui/data-table";
import { formatCurrency } from "@/shared/utils/format";
import type { ApiResource } from "@/shared/types/api.types";
import type { RecipeAttributes } from "@/infrastructure/api/mocks/recipes.mock";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<ApiResource<RecipeAttributes>>[] = [
  {
    accessorKey: "attributes.name",
    header: "Receta",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.attributes.name}</span>
    ),
  },
  {
    id: "cost",
    header: "Costo total",
    cell: ({ row }) => formatCurrency(row.original.attributes.totalCost ?? 0),
  },
  {
    id: "price",
    header: "Precio sugerido",
    cell: ({ row }) =>
      formatCurrency(
        row.original.attributes.customSalePrice ??
          row.original.attributes.suggestedPrice ??
          0
      ),
  },
  {
    id: "stock",
    header: "Disponible",
    cell: ({ row }) => row.original.attributes.finishedStock ?? 0,
  },
  {
    id: "status",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant={row.original.attributes.isActive ? "default" : "secondary"}>
        {row.original.attributes.isActive ? "Activa" : "Inactiva"}
      </Badge>
    ),
  },
];

interface RecipesListProps {
  data: ApiResource<RecipeAttributes>[];
  loading?: boolean;
}

export function RecipesList({ data, loading }: RecipesListProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      searchKey="attributes.name"
      searchPlaceholder="Buscar receta..."
      onRowClick={(row) => router.push(`/recipes/${row.id}`)}
    />
  );
}
