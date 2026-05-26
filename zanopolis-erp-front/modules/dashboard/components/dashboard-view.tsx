"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/shared/ui/stat-card";
import { formatCurrency, formatDateTime } from "@/shared/utils/format";
import { useDashboard } from "../hooks/use-dashboard";
import {
  AlertTriangle,
  DollarSign,
  Factory,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";
import { getStockStatus } from "@/shared/ui/status-badge";

export function DashboardView() {
  const { data, isLoading } = useDashboard();

  const finance = data?.finance;
  const chartData = [
    { name: "Lun", ventas: 85000 },
    { name: "Mar", ventas: 92000 },
    { name: "Mié", ventas: 110000 },
    { name: "Jue", ventas: 78000 },
    { name: "Vie", ventas: 145000 },
    { name: "Sáb", ventas: 132000 },
    { name: "Hoy", ventas: finance?.income ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ventas hoy"
          value={isLoading ? "—" : formatCurrency(finance?.income ?? 0)}
          icon={DollarSign}
          description={`${finance?.salesCount ?? 0} ventas registradas`}
        />
        <StatCard
          title="Utilidad hoy"
          value={isLoading ? "—" : formatCurrency(finance?.profit ?? 0)}
          icon={TrendingUp}
          trend={{ value: "+12%", positive: true }}
        />
        <StatCard
          title="Producción pendiente"
          value={isLoading ? "—" : String(data?.upcomingProduction.length ?? 0)}
          icon={Factory}
          description="órdenes programadas"
        />
        <StatCard
          title="Stock crítico"
          value={isLoading ? "—" : String(data?.lowStock.length ?? 0)}
          icon={AlertTriangle}
          description="ingredientes bajo mínimo"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-base">Ventas semanales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), "Ventas"]}
                  contentStyle={{ borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                />
                <Bar dataKey="ventas" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-base">Stock crítico</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/ingredients">Ver todo</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando...</p>
            ) : data?.lowStock.length ? (
              data.lowStock.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.attributes.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.attributes.currentStock} {item.attributes.unit}
                    </p>
                  </div>
                  <StatusBadge
                    variant={getStockStatus(
                      item.attributes.currentStock ?? 0,
                      item.attributes.minimumStock ?? 0
                    )}
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Sin alertas de stock</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-base">Próximas producciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.upcomingProduction.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{order.attributes.recipeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.attributes.quantity} unidades ·{" "}
                    {order.attributes.scheduledDate
                      ? formatDateTime(order.attributes.scheduledDate)
                      : "Sin fecha"}
                  </p>
                </div>
                <StatusBadge variant="planned" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-base">Ventas recientes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sales">Ver todo</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">
                    {sale.attributes.clientName ?? "Venta mostrador"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(sale.attributes.saleDate)}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {formatCurrency(sale.attributes.totalAmount)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
