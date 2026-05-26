"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function QuantityInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  className,
}: QuantityInputProps) {
  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(max !== undefined ? Math.min(max, value + step) : value + step);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button type="button" variant="outline" size="icon-sm" onClick={decrement}>
        <Minus className="size-3" />
      </Button>
      <Input
        type="number"
        className="h-8 w-16 text-center"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value) || min)}
      />
      <Button type="button" variant="outline" size="icon-sm" onClick={increment}>
        <Plus className="size-3" />
      </Button>
    </div>
  );
}
