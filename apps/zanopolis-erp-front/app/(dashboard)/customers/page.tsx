"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { CustomersTable } from "@/modules/customers/components/customers-table";
import { useCustomers } from "@/modules/customers/hooks/use-customers";
import { Plus } from "lucide-react";

export default function CustomersPage() {
  const { data, isLoading } = useCustomers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="CRM ligero — historial y productos frecuentes"
        actions={
          <Button size="sm">
            <Plus className="mr-2 size-4" />
            Nuevo cliente
          </Button>
        }
      />
      <CustomersTable data={data?.data ?? []} loading={isLoading} />
    </div>
  );
}
