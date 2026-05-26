"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { CustomerDetail } from "@/modules/customers/components/customer-detail";
import { useCustomer } from "@/modules/customers/hooks/use-customers";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useCustomer(id);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!data) return <p>Cliente no encontrado</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={data.data.attributes.name}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/customers">
              <ArrowLeft className="mr-2 size-4" />
              Volver
            </Link>
          </Button>
        }
      />
      <CustomerDetail id={id} attributes={data.data.attributes} />
    </div>
  );
}
