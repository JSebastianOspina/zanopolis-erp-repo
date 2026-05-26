"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatCard } from "@/shared/ui/stat-card";
import { formatCurrency } from "@/shared/utils/format";
import { useDailyFinance, useMonthlyFinance } from "../hooks/use-finance";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function FinanceView() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5);

  const { data: daily, isLoading: dailyLoading } = useDailyFinance(date);
  const { data: monthly, isLoading: monthlyLoading } = useMonthlyFinance(year, month);

  const dailyAttrs = daily?.data.attributes;
  const monthlyAttrs = monthly?.data.attributes;

  return (
    <Tabs defaultValue="daily" className="space-y-6">
      <TabsList>
        <TabsTrigger value="daily">Diario</TabsTrigger>
        <TabsTrigger value="monthly">Mensual</TabsTrigger>
      </TabsList>

      <TabsContent value="daily" className="space-y-6">
        <div className="max-w-xs space-y-2">
          <Label>Fecha</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Ingresos"
            value={dailyLoading ? "—" : formatCurrency(dailyAttrs?.income ?? 0)}
            icon={DollarSign}
          />
          <StatCard
            title="Egresos"
            value={dailyLoading ? "—" : formatCurrency(dailyAttrs?.expenses ?? 0)}
            icon={TrendingDown}
          />
          <StatCard
            title="Utilidad"
            value={dailyLoading ? "—" : formatCurrency(dailyAttrs?.profit ?? 0)}
            icon={TrendingUp}
          />
        </div>
      </TabsContent>

      <TabsContent value="monthly" className="space-y-6">
        <div className="flex gap-4">
          <div className="space-y-2">
            <Label>Año</Label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-24"
            />
          </div>
          <div className="space-y-2">
            <Label>Mes</Label>
            <Input
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-20"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Ingresos del mes"
            value={monthlyLoading ? "—" : formatCurrency(monthlyAttrs?.income ?? 0)}
            icon={DollarSign}
          />
          <StatCard
            title="Egresos del mes"
            value={monthlyLoading ? "—" : formatCurrency(monthlyAttrs?.expenses ?? 0)}
            icon={TrendingDown}
          />
          <StatCard
            title="Utilidad del mes"
            value={monthlyLoading ? "—" : formatCurrency(monthlyAttrs?.profit ?? 0)}
            icon={TrendingUp}
          />
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-base">Tendencia — ventas vs compras</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyAttrs?.dailyBreakdown ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(8)} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Ingresos"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.15}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Egresos"
                  stroke="var(--destructive)"
                  fill="var(--destructive)"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
