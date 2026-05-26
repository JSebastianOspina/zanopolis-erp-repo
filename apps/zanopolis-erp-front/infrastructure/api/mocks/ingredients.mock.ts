import type { ApiResource } from "@/shared/types/api.types";

export interface IngredientAttributes {
  name: string;
  unit: string;
  currentStock?: number;
  minimumStock?: number;
  averageCostPerUnit?: number;
  category: "RAW_MATERIAL" | "PACKAGING" | "DECORATION" | "OTHER";
  isActive?: boolean;
}

export const ingredientsMock: ApiResource<IngredientAttributes>[] = [
  {
    type: "ingredient",
    id: "ing-001",
    attributes: {
      name: "Harina de Trigo",
      unit: "kg",
      currentStock: 1.5,
      minimumStock: 2,
      averageCostPerUnit: 5500,
      category: "RAW_MATERIAL",
      isActive: true,
    },
  },
  {
    type: "ingredient",
    id: "ing-002",
    attributes: {
      name: "Azúcar",
      unit: "kg",
      currentStock: 8,
      minimumStock: 3,
      averageCostPerUnit: 4200,
      category: "RAW_MATERIAL",
      isActive: true,
    },
  },
  {
    type: "ingredient",
    id: "ing-003",
    attributes: {
      name: "Mantequilla",
      unit: "kg",
      currentStock: 4.2,
      minimumStock: 2,
      averageCostPerUnit: 18500,
      category: "RAW_MATERIAL",
      isActive: true,
    },
  },
  {
    type: "ingredient",
    id: "ing-004",
    attributes: {
      name: "Huevos",
      unit: "un",
      currentStock: 48,
      minimumStock: 24,
      averageCostPerUnit: 450,
      category: "RAW_MATERIAL",
      isActive: true,
    },
  },
  {
    type: "ingredient",
    id: "ing-005",
    attributes: {
      name: "Chocolate 70%",
      unit: "kg",
      currentStock: 0.8,
      minimumStock: 1.5,
      averageCostPerUnit: 32000,
      category: "RAW_MATERIAL",
      isActive: true,
    },
  },
];
