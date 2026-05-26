"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/ui/data-table";
import { formatCurrency, formatDate } from "@/shared/utils/format";
import type { ApiResource } from "@/shared/types/api.types";
import type { ClientAttributes } from "@/infrastructure/api/mocks/clients.mock";
import { useRouter } from "next/navigation";

const columns: ColumnDef<ApiResource<ClientAttributes>>[] = [
  {
    accessorKey: "attributes.name",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.attributes.name}</span>
    ),
  },
  {
    accessorKey: "attributes.phone",
    header: "Teléfono",
    cell: ({ row }) => row.original.attributes.phone ?? "—",
  },
  {
    id: "lastPurchase",
    header: "Última compra",
    cell: ({ row }) =>
      row.original.attributes.lastPurchaseDate
        ? formatDate(row.original.attributes.lastPurchaseDate)
        : "—",
  },
  {
    id: "total",
    header: "Total comprado",
    cell: ({ row }) => formatCurrency(row.original.attributes.totalPurchased ?? 0),
  },
];

interface CustomersTableProps {
  data: ApiResource<ClientAttributes>[];
  loading?: boolean;
}

export function CustomersTable({ data, loading }: CustomersTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      searchKey="attributes.name"
      searchPlaceholder="Buscar cliente..."
      onRowClick={(row) => router.push(`/customers/${row.id}`)}
    />
  );
}
