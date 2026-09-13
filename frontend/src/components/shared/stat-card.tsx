import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
}

export function StatCard({ title, value, icon: Icon, change }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <span
            className={`text-xs font-medium ${
              change.trend === 'up'
                ? 'text-green-600'
                : change.trend === 'down'
                ? 'text-red-600'
                : 'text-muted-foreground'
            }`}
          >
            {change.trend === 'up' ? '+' : change.trend === 'down' ? '-' : ''}
            {change.value}%
          </span>
        )}
      </div>
    </div>
  );
}
