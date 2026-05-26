import type { ApiResource } from "@/shared/types/api.types";

export interface RecipeItemAttributes {
  type: "INGREDIENT" | "RECIPE";
  referenceId: string;
  quantity: number;
  name?: string;
  unitCost?: number;
}

export interface RecipeAttributes {
  name: string;
  laborCost?: number;
  marginPercentage?: number;
  customSalePrice?: number;
  isActive?: boolean;
  totalCost?: number;
  unitCost?: number;
  suggestedPrice?: number;
  finishedStock?: number;
  items?: RecipeItemAttributes[];
}

export const recipesMock: ApiResource<RecipeAttributes>[] = [
  {
    type: "recipe",
    id: "rec-001",
    attributes: {
      name: "Torta de Chocolate",
      laborCost: 5000,
      marginPercentage: 30,
      customSalePrice: 45000,
      isActive: true,
      totalCost: 28500,
      unitCost: 28500,
      suggestedPrice: 45000,
      finishedStock: 3,
      items: [
        { type: "INGREDIENT", referenceId: "ing-001", quantity: 0.5, name: "Harina de Trigo", unitCost: 2750 },
        { type: "INGREDIENT", referenceId: "ing-002", quantity: 0.3, name: "Azúcar", unitCost: 1260 },
        { type: "INGREDIENT", referenceId: "ing-005", quantity: 0.2, name: "Chocolate 70%", unitCost: 6400 },
        { type: "INGREDIENT", referenceId: "ing-003", quantity: 0.15, name: "Mantequilla", unitCost: 2775 },
      ],
    },
  },
  {
    type: "recipe",
    id: "rec-002",
    attributes: {
      name: "Masa Básica",
      laborCost: 2000,
      marginPercentage: 25,
      isActive: true,
      totalCost: 8500,
      unitCost: 8500,
      suggestedPrice: 12000,
      finishedStock: 0,
      items: [
        { type: "INGREDIENT", referenceId: "ing-001", quantity: 1, name: "Harina de Trigo", unitCost: 5500 },
        { type: "INGREDIENT", referenceId: "ing-004", quantity: 3, name: "Huevos", unitCost: 1350 },
      ],
    },
  },
  {
    type: "recipe",
    id: "rec-003",
    attributes: {
      name: "Cupcakes Vainilla",
      laborCost: 3000,
      marginPercentage: 35,
      customSalePrice: 8000,
      isActive: true,
      totalCost: 5200,
      unitCost: 5200,
      suggestedPrice: 8000,
      finishedStock: 12,
      items: [
        { type: "RECIPE", referenceId: "rec-002", quantity: 0.5, name: "Masa Básica", unitCost: 4250 },
        { type: "INGREDIENT", referenceId: "ing-002", quantity: 0.1, name: "Azúcar", unitCost: 420 },
      ],
    },
  },
];
