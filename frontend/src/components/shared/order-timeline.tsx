import { OrderEvent, OrderStatus } from '@/types';
import { CheckCircle2, Circle } from 'lucide-react';
import { ORDER_STATUSES } from '@/constants';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  timeline: OrderEvent[];
}

export function OrderTimeline({ currentStatus, timeline }: OrderTimelineProps) {
  const currentIndex = ORDER_STATUSES.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      {ORDER_STATUSES.map((status, index) => {
        const isCompleted = index <= currentIndex;
        const isActive = index === currentIndex;
        
        return (
          <div key={status} className="flex gap-4">
            <div className="flex flex-col items-center">
              {isCompleted ? (
                <CheckCircle2 className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-primary/60'}`} />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground/30" />
              )}
              {index < ORDER_STATUSES.length - 1 && (
                <div className={`w-0.5 h-full min-h-[2rem] my-1 ${index < currentIndex ? 'bg-primary/60' : 'bg-muted-foreground/20'}`} />
              )}
            </div>
            <div className="pb-4">
              <h4 className={`text-sm font-medium capitalize ${isActive ? 'text-primary font-bold' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                {status}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}
