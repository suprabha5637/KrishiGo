'use client';
import { QualityGrade } from '@/types';
import { cn } from '@/lib/utils';

interface QualitySelectorProps {
  selected: QualityGrade;
  onChange: (quality: QualityGrade) => void;
}

export function QualitySelector({ selected, onChange }: QualitySelectorProps) {
  const grades: { id: QualityGrade; label: string; color: string }[] = [
    { id: 'Premium', label: 'Premium', color: 'border-accent text-accent' },
    { id: 'Standard', label: 'Standard', color: 'border-primary text-primary' },
    { id: 'Value', label: 'Value', color: 'border-blue-500 text-blue-500' },
  ];

  return (
    <div className="flex gap-2">
      {grades.map((grade) => (
        <button
          key={grade.id}
          onClick={() => onChange(grade.id)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium border-2 transition-all',
            selected === grade.id 
              ? `${grade.color} bg-background shadow-sm` 
              : 'border-transparent bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {grade.label}
        </button>
      ))}
    </div>
  );
}
