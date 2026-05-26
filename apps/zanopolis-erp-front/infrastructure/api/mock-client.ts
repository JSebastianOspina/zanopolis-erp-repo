import { ApiClientError, type ApiCollection, type ApiResource } from "@/shared/types/api.types";
import type { IApiClient } from "./types";
import { clientsMock } from "./mocks/clients.mock";
import { dailyFinanceMock, monthlyFinanceMock } from "./mocks/finance.mock";
import { ingredientsMock, type IngredientAttributes } from "./mocks/ingredients.mock";
import type { SupplierAttributes } from "./mocks/suppliers.mock";
import type { PurchaseAttributes } from "./mocks/purchases.mock";
import type { RecipeAttributes } from "./mocks/recipes.mock";
import type { ClientAttributes } from "./mocks/clients.mock";
import type { ProductionOrderAttributes } from "./mocks/production-orders.mock";
import type { SaleAttributes } from "./mocks/sales.mock";
import type { WasteRecordAttributes } from "./mocks/waste-records.mock";
import { inventoryMovementsMock } from "./mocks/inventory-movements.mock";
import { productionOrdersMock } from "./mocks/production-orders.mock";
import { purchasesMock } from "./mocks/purchases.mock";
import { recipesMock } from "./mocks/recipes.mock";
import { salesMock } from "./mocks/sales.mock";
import { suppliersMock } from "./mocks/suppliers.mock";
import { wasteRecordsMock } from "./mocks/waste-records.mock";

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

function paginate<T>(items: T[], limit = 50, offset = 0): T[] {
  return items.slice(offset, offset + limit);
}

function collection<T>(items: T[], limit?: number, offset?: number): ApiCollection<T extends ApiResource<infer A> ? A : never> {
  const l = limit ?? 50;
  const o = offset ?? 0;
  const data = paginate(items, l, o) as ApiResource[];
  return { data, meta: { total: items.length } } as ApiCollection<T extends ApiResource<infer A> ? A : never>;
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`;
}

// Mutable in-memory stores for mock mutations
const stores: {
  ingredients: typeof ingredientsMock;
  suppliers: typeof suppliersMock;
  purchases: typeof purchasesMock;
  recipes: typeof recipesMock;
  clients: typeof clientsMock;
  productionOrders: typeof productionOrdersMock;
  sales: typeof salesMock;
  inventoryMovements: typeof inventoryMovementsMock;
  wasteRecords: typeof wasteRecordsMock;
} = {
  ingredients: [...ingredientsMock],
  suppliers: [...suppliersMock],
  purchases: [...purchasesMock],
  recipes: [...recipesMock],
  clients: [...clientsMock],
  productionOrders: [...productionOrdersMock],
  sales: [...salesMock],
  inventoryMovements: [...inventoryMovementsMock],
  wasteRecords: [...wasteRecordsMock],
};

function matchPath(path: string): { resource: string; id?: string; action?: string } {
  const clean = path.replace(/^\//, "").split("?")[0];
  const parts = clean.split("/");
  return {
    resource: parts[0] ?? "",
    id: parts[1],
    action: parts[2],
  };
}

async function handleGet(path: string, params?: Record<string, unknown>): Promise<unknown> {
  const { resource, id, action } = matchPath(path);
  const limit = params?.limit as number | undefined;
  const offset = params?.offset as number | undefined;

  switch (resource) {
    case "ingredients": {
      if (action === "low-stock" || id === "low-stock") {
        const low = stores.ingredients.filter(
          (i) =>
            (i.attributes.currentStock ?? 0) <= (i.attributes.minimumStock ?? 0)
        );
        return { data: low };
      }
      if (id) {
        const item = stores.ingredients.find((i) => i.id === id);
        if (!item) throw new ApiClientError("ingredient not found", 404);
        return { data: item };
      }
      return collection(stores.ingredients, limit, offset);
    }
    case "suppliers": {
      if (id) {
        const item = stores.suppliers.find((s) => s.id === id);
        if (!item) throw new ApiClientError("supplier not found", 404);
        return { data: item };
      }
      return collection(stores.suppliers, limit, offset);
    }
    case "purchases": {
      if (id) {
        const item = stores.purchases.find((p) => p.id === id);
        if (!item) throw new ApiClientError("purchase not found", 404);
        return { data: item };
      }
      return collection(stores.purchases, limit, offset);
    }
    case "recipes": {
      if (id) {
        const item = stores.recipes.find((r) => r.id === id);
        if (!item) throw new ApiClientError("recipe not found", 404);
        return { data: item };
      }
      return collection(stores.recipes, limit, offset);
    }
    case "clients": {
      if (id) {
        const item = stores.clients.find((c) => c.id === id);
        if (!item) throw new ApiClientError("client not found", 404);
        return { data: item };
      }
      return collection(stores.clients, limit, offset);
    }
    case "production-orders": {
      if (id === "upcoming" || action === "upcoming") {
        const upcoming = stores.productionOrders.filter(
          (o) => o.attributes.status === "PLANNED"
        );
        return { data: upcoming };
      }
      if (id) {
        const item = stores.productionOrders.find((o) => o.id === id);
        if (!item) throw new ApiClientError("production-order not found", 404);
        return { data: item };
      }
      return collection(stores.productionOrders, limit, offset);
    }
    case "sales": {
      if (id) {
        const item = stores.sales.find((s) => s.id === id);
        if (!item) throw new ApiClientError("sale not found", 404);
        return { data: item };
      }
      return collection(stores.sales, limit, offset);
    }
    case "finance": {
      if (id === "daily" || action === "daily") {
        return { data: { type: "finance-daily", id: "daily", attributes: dailyFinanceMock } };
      }
      if (id === "monthly" || action === "monthly") {
        return { data: { type: "finance-monthly", id: "monthly", attributes: monthlyFinanceMock } };
      }
      break;
    }
    case "inventory-movements":
      return collection(stores.inventoryMovements, limit, offset);
    case "waste-records":
      return collection(stores.wasteRecords, limit, offset);
    default:
      return { data: [] };
  }
}

async function handlePost(path: string, body?: unknown, params?: Record<string, unknown>): Promise<unknown> {
  const { resource, id, action } = matchPath(path);
  const payload = body as Record<string, unknown>;

  switch (resource) {
    case "ingredients": {
      const newItem = {
        type: "ingredient" as const,
        id: generateId("ing"),
        attributes: {
          currentStock: 0,
          isActive: true,
          name: String(payload.name ?? "Nuevo"),
          unit: String(payload.unit ?? "kg"),
          category: (payload.category as IngredientAttributes["category"]) ?? "RAW_MATERIAL",
          ...payload,
        },
      };
      stores.ingredients.push(newItem);
      return { data: newItem };
    }
    case "suppliers": {
      const newItem = {
        type: "supplier" as const,
        id: generateId("sup"),
        attributes: { name: String(payload.name ?? "Proveedor"), ...payload } as SupplierAttributes,
      };
      stores.suppliers.push(newItem);
      return { data: newItem };
    }
    case "purchases": {
      const items = payload.items as Array<{ totalCost: number }>;
      const totalCost = items?.reduce((sum, i) => sum + i.totalCost, 0) ?? 0;
      const newItem = {
        type: "purchase" as const,
        id: generateId("pur"),
        attributes: {
          supplierId: String(payload.supplierId ?? ""),
          paymentMethod: (payload.paymentMethod as PurchaseAttributes["paymentMethod"]) ?? "CASH",
          totalCost,
          purchaseDate: new Date().toISOString(),
        },
      };
      stores.purchases.unshift(newItem);
      return { data: newItem };
    }
    case "recipes": {
      if (action === "duplicate") {
        const original = stores.recipes.find((r) => r.id === id);
        if (!original) throw new ApiClientError("recipe not found", 404);
        const copy = {
          ...original,
          id: generateId("rec"),
          attributes: {
            ...original.attributes,
            name: `${original.attributes.name} (Copia)`,
          },
        };
        stores.recipes.push(copy);
        return { data: copy };
      }
      if (action === "recalculate-cost") {
        const recipe = stores.recipes.find((r) => r.id === id);
        if (!recipe) throw new ApiClientError("recipe not found", 404);
        const items = recipe.attributes.items ?? [];
        const ingredientsCost = items.reduce(
          (sum, item) => sum + (item.unitCost ?? 0) * item.quantity,
          0
        );
        const totalCost = ingredientsCost + (recipe.attributes.laborCost ?? 0);
        recipe.attributes.totalCost = totalCost;
        recipe.attributes.unitCost = totalCost;
        if (recipe.attributes.marginPercentage) {
          recipe.attributes.suggestedPrice = Math.round(
            totalCost * (1 + recipe.attributes.marginPercentage / 100)
          );
        }
        return { data: recipe };
      }
      const newItem = {
        type: "recipe" as const,
        id: generateId("rec"),
        attributes: {
          name: String(payload.name ?? "Nueva receta"),
          isActive: true,
          items: [],
          ...payload,
        } as RecipeAttributes,
      };
      stores.recipes.push(newItem);
      return { data: newItem };
    }
    case "clients": {
      const newItem = {
        type: "client" as const,
        id: generateId("cli"),
        attributes: {
          name: String(payload.name ?? "Cliente"),
          totalPurchased: 0,
          ...payload,
        } as ClientAttributes,
      };
      stores.clients.push(newItem);
      return { data: newItem };
    }
    case "production-orders": {
      if (action === "complete") {
        const order = stores.productionOrders.find((o) => o.id === id);
        if (!order) throw new ApiClientError("production-order not found", 404);
        order.attributes.status = "COMPLETED";
        return { data: order };
      }
      const recipe = stores.recipes.find((r) => r.id === payload.recipeId);
      const newItem = {
        type: "production-order" as const,
        id: generateId("po"),
        attributes: {
          recipeId: String(payload.recipeId ?? ""),
          quantity: Number(payload.quantity ?? 1),
          recipeName: recipe?.attributes.name,
          status: "PLANNED" as const,
          notes: payload.notes as string | undefined,
          scheduledDate: payload.scheduledDate as string | undefined,
        },
      };
      stores.productionOrders.unshift(newItem);
      return { data: newItem };
    }
    case "sales": {
      const items = payload.items as Array<{ customSalePrice: number; quantity: number; costSnapshot?: number }>;
      const totalAmount = items?.reduce((sum, i) => sum + i.customSalePrice * i.quantity, 0) ?? 0;
      const totalCost = items?.reduce((sum, i) => sum + (i.costSnapshot ?? 0) * i.quantity, 0) ?? 0;
      const newItem = {
        type: "sale" as const,
        id: generateId("sal"),
        attributes: {
          paymentMethod: (payload.paymentMethod as SaleAttributes["paymentMethod"]) ?? "CASH",
          clientId: payload.clientId as string | undefined,
          totalAmount,
          totalCost,
          profit: totalAmount - totalCost,
          saleDate: new Date().toISOString(),
          items: payload.items as SaleAttributes["items"],
        },
      };
      stores.sales.unshift(newItem);
      return { data: newItem, createProductionIfNeeded: params?.createProductionIfNeeded };
    }
    case "waste-records": {
      const newItem = {
        type: "waste-record" as const,
        id: generateId("wst"),
        attributes: {
          referenceType: payload.referenceType as WasteRecordAttributes["referenceType"],
          referenceId: String(payload.referenceId ?? ""),
          quantity: Number(payload.quantity ?? 0),
          notes: payload.notes as string | undefined,
          createdAt: new Date().toISOString(),
        },
      };
      stores.wasteRecords.unshift(newItem);
      return { data: newItem };
    }
    default:
      return { data: null };
  }
}

async function handlePatch(path: string, body?: unknown): Promise<unknown> {
  const { resource, id } = matchPath(path);
  const payload = body as Record<string, unknown>;

  const updateStore = <A extends object>(
    store: ApiResource<A>[],
    notFoundMsg: string
  ) => {
    const item = store.find((i) => i.id === id);
    if (!item) throw new ApiClientError(notFoundMsg, 404);
    item.attributes = { ...item.attributes, ...(payload as Partial<A>) };
    return { data: item };
  };

  switch (resource) {
    case "ingredients":
      return updateStore(stores.ingredients, "ingredient not found");
    case "suppliers":
      return updateStore(stores.suppliers, "supplier not found");
    case "recipes":
      return updateStore(stores.recipes, "recipe not found");
    case "clients":
      return updateStore(stores.clients, "client not found");
    case "production-orders":
      return updateStore(stores.productionOrders, "production-order not found");
    default:
      return { data: null };
  }
}

async function handleDelete(path: string): Promise<unknown> {
  const { resource, id } = matchPath(path);

  const deleteFromStore = <A extends object>(
    store: ApiResource<A>[],
    notFoundMsg: string
  ) => {
    const index = store.findIndex((i) => i.id === id);
    if (index === -1) throw new ApiClientError(notFoundMsg, 404);
    store.splice(index, 1);
    return { message: "Entity deleted successfully" };
  };

  switch (resource) {
    case "ingredients":
      return deleteFromStore(stores.ingredients, "ingredient not found");
    case "suppliers":
      return deleteFromStore(stores.suppliers, "supplier not found");
    case "recipes":
      return deleteFromStore(stores.recipes, "recipe not found");
    case "clients":
      return deleteFromStore(stores.clients, "client not found");
    case "production-orders":
      return deleteFromStore(stores.productionOrders, "production-order not found");
    case "sales":
      return deleteFromStore(stores.sales, "sale not found");
    default:
      return { message: "Entity deleted successfully" };
  }
}

export const mockClient: IApiClient = {
  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    await delay();
    return handleGet(path, params) as T;
  },
  async post<T>(path: string, body?: unknown, params?: Record<string, unknown>): Promise<T> {
    await delay(150);
    return handlePost(path, body, params) as T;
  },
  async patch<T>(path: string, body?: unknown): Promise<T> {
    await delay(150);
    return handlePatch(path, body) as T;
  },
  async delete<T>(path: string): Promise<T> {
    await delay(100);
    return handleDelete(path) as T;
  },
};
