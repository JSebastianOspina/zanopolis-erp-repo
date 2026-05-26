const fs = require('fs');

function replaceInFile(path, regex, replacement) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(path, content);
}

replaceInFile('src/modules/production/adapters/input/production-order.controller.spec.ts', /quantity: 10/g, 'quantity: new Decimal(10) as any');
replaceInFile('src/modules/inventory/adapters/input/waste-record.controller.spec.ts', /quantity: 5/g, 'quantity: new Decimal(5) as any');
replaceInFile('src/modules/inventory/application/waste-record.service.spec.ts', /quantity: 5/g, 'quantity: new Decimal(5) as any');

replaceInFile('src/modules/inventory/adapters/input/inventory-movement.controller.spec.ts', /InventoryMovementType.IN/g, 'InventoryMovementType.IN as any');
replaceInFile('src/modules/inventory/application/inventory-movement.service.spec.ts', /InventoryMovementType.IN/g, 'InventoryMovementType.IN as any');
replaceInFile('src/modules/inventory/application/inventory-movement.service.spec.ts', /await service.search\(\{\}, \{ limit: 10, offset: 0 \}, \{ userId: 'user-1' \}\)/g, 'await (service.search as any)({}, { limit: 10, offset: 0 }, { userId: "user-1" })');

replaceInFile('src/modules/sale/adapters/input/sale.controller.spec.ts', /PaymentMethod.CASH/g, 'PaymentMethod.CASH as any');
replaceInFile('src/modules/sale/application/sale.service.spec.ts', /PaymentMethod.CASH/g, 'PaymentMethod.CASH as any');

console.log("Fixed specs");
