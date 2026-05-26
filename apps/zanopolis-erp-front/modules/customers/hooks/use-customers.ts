"use client";

import { useQuery } from "@tanstack/react-query";
import { customersService } from "../services/customers.service";

export function useCustomers() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => customersService.list(),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => customersService.getById(id),
    enabled: !!id,
  });
}
