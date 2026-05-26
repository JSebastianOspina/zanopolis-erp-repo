const fs = require('fs');

function replaceInFile(path, regex, replacement) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(path, content);
}

replaceInFile('src/modules/production/adapters/input/production-order.controller.spec.ts', /IProductionOrderService/g, 'ProductionOrderService');
let poSpec = fs.readFileSync('src/modules/production/adapters/input/production-order.controller.spec.ts', 'utf8');
if (!poSpec.includes('import Decimal')) {
  fs.writeFileSync('src/modules/production/adapters/input/production-order.controller.spec.ts', "import Decimal from 'decimal.js';\n" + poSpec);
}

replaceInFile('src/modules/sale/adapters/input/sale.controller.spec.ts', /ISaleService/g, 'SaleService');

replaceInFile('src/modules/finance/adapters/input/finance.controller.spec.ts', /IFinanceService/g, 'FinanceService');

replaceInFile('src/modules/inventory/adapters/input/inventory-movement.controller.spec.ts', /IInventoryMovementService/g, 'InventoryMovementService');

replaceInFile('src/modules/inventory/adapters/input/waste-record.controller.spec.ts', /IWasteRecordService/g, 'WasteRecordService');
let wrSpec = fs.readFileSync('src/modules/inventory/adapters/input/waste-record.controller.spec.ts', 'utf8');
if (!wrSpec.includes('import Decimal')) {
  fs.writeFileSync('src/modules/inventory/adapters/input/waste-record.controller.spec.ts', "import Decimal from 'decimal.js';\n" + wrSpec);
}

console.log("Fixed specs 3");
