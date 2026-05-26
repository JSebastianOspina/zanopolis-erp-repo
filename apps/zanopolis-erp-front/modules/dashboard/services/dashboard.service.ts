import { financeService } from "@/modules/finance/services/finance.service";
import { ingredientsService } from "@/modules/ingredients/services/ingredients.service";
import { productionService } from "@/modules/production/services/production.service";
import { salesService } from "@/modules/sales/services/sales.service";

export const dashboardService = {
  async getSummary() {
    const today = new Date().toISOString().split("T")[0];
    const [finance, lowStock, upcoming, recentSales] = await Promise.all([
      financeService.getDaily(today),
      ingredientsService.getLowStock(),
      productionService.getUpcoming(),
      salesService.list({ limit: 5 }),
    ]);

    return {
      finance: finance.data.attributes,
      lowStock: lowStock.data,
      upcomingProduction: upcoming.data,
      recentSales: recentSales.data,
    };
  },
};
