import type { ApiResource } from "@/shared/types/api.types";

export interface WasteRecordAttributes {
  referenceType: "INGREDIENT" | "RECIPE";
  referenceId: string;
  referenceName?: string;
  quantity: number;
  notes?: string;
  createdAt: string;
}

export const wasteRecordsMock: ApiResource<WasteRecordAttributes>[] = [
  {
    type: "waste-record",
    id: "wst-001",
    attributes: {
      referenceType: "INGREDIENT",
      referenceId: "ing-003",
      referenceName: "Mantequilla",
      quantity: 0.2,
      notes: "Vencimiento",
      createdAt: "2026-05-15T16:00:00.000Z",
    },
  },
];
