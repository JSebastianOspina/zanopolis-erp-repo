import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IngredientModule } from './modules/ingredient/ingredient.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { RecipeModule } from './modules/recipe/recipe.module';
import { ClientModule } from './modules/client/client.module';
import { ProductionOrderModule } from './modules/production/production-order.module';
import { SaleModule } from './modules/sale/sale.module';
import { FinanceModule } from './modules/finance/finance.module';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [
    IngredientModule,
    SupplierModule,
    PurchaseModule,
    RecipeModule,
    ClientModule,
    ProductionOrderModule,
    SaleModule,
    FinanceModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
