interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  unit?: string;
  className?: string;
}

export function PriceDisplay({ price, originalPrice, unit, className = '' }: PriceDisplayProps) {
  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="text-xl font-bold">₹{price}</span>
      {originalPrice && (
        <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>
      )}
      {unit && (
        <span className="text-sm text-muted-foreground">/{unit}</span>
      )}
    </div>
  );
}
