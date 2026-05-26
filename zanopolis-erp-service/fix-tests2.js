const fs = require('fs');

function replaceInFile(path, regex, replacement) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(path, content);
}

// Controller inject tokens
replaceInFile('src/modules/production/adapters/input/production-order.controller.spec.ts', /provide: 'IProductionOrderService'/g, 'provide: require("../../../application/production-order.service").ProductionOrderService');
replaceInFile('src/modules/sale/adapters/input/sale.controller.spec.ts', /provide: 'ISaleService'/g, 'provide: require("../../../application/sale.service").SaleService');
replaceInFile('src/modules/finance/adapters/input/finance.controller.spec.ts', /provide: 'IFinanceService'/g, 'provide: require("../../../application/finance.service").FinanceService');
replaceInFile('src/modules/inventory/adapters/input/inventory-movement.controller.spec.ts', /provide: 'IInventoryMovementService'/g, 'provide: require("../../../application/inventory-movement.service").InventoryMovementService');
replaceInFile('src/modules/inventory/adapters/input/waste-record.controller.spec.ts', /provide: 'IWasteRecordService'/g, 'provide: require("../../../application/waste-record.service").WasteRecordService');

// Fix service get from module
replaceInFile('src/modules/production/adapters/input/production-order.controller.spec.ts', /service = module.get\('IProductionOrderService'\);/g, 'service = module.get(require("../../../application/production-order.service").ProductionOrderService);');
replaceInFile('src/modules/sale/adapters/input/sale.controller.spec.ts', /service = module.get\('ISaleService'\);/g, 'service = module.get(require("../../../application/sale.service").SaleService);');
replaceInFile('src/modules/finance/adapters/input/finance.controller.spec.ts', /service = module.get\('IFinanceService'\);/g, 'service = module.get(require("../../../application/finance.service").FinanceService);');
replaceInFile('src/modules/inventory/adapters/input/inventory-movement.controller.spec.ts', /service = module.get\('IInventoryMovementService'\);/g, 'service = module.get(require("../../../application/inventory-movement.service").InventoryMovementService);');
replaceInFile('src/modules/inventory/adapters/input/waste-record.controller.spec.ts', /service = module.get\('IWasteRecordService'\);/g, 'service = module.get(require("../../../application/waste-record.service").WasteRecordService);');

// ProductionOrderService tests types
replaceInFile('src/modules/production/application/production-order.service.spec.ts', /quantity: 10/g, 'quantity: new (require("decimal.js").default)(10) as any');

// WasteRecordService tests missing Decimal import
let wasteRecordSpec = fs.readFileSync('src/modules/inventory/application/waste-record.service.spec.ts', 'utf8');
if (!wasteRecordSpec.includes('import Decimal')) {
  wasteRecordSpec = "import Decimal from 'decimal.js';\n" + wasteRecordSpec;
  fs.writeFileSync('src/modules/inventory/application/waste-record.service.spec.ts', wasteRecordSpec);
}

console.log("Fixed specs 2");
