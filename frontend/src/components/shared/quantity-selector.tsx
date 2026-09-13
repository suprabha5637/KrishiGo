'use client';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  unit: string;
  min?: number;
  max?: number;
  onChange: (quantity: number) => void;
}

export function QuantitySelector({ quantity, unit, min = 1, max = 99, onChange }: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border rounded-md">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-none rounded-l-md" 
          onClick={handleDecrement}
          disabled={quantity <= min}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <div className="w-10 text-center text-sm font-medium">
          {quantity}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-none rounded-r-md" 
          onClick={handleIncrement}
          disabled={quantity >= max}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <span className="text-sm text-muted-foreground">{unit}</span>
    </div>
  );
}
