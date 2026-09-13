import Link from 'next/link';
import { Category } from '@/types';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  // @ts-ignore
  const Icon = category.icon && Icons[category.icon] ? Icons[category.icon] : Icons.Box;

  return (
    <Link href={`/products?category=${category.slug}`}>
      <div className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:bg-primary/5 transition-colors cursor-pointer group min-w-[100px]">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <span className="text-sm font-medium text-center">{category.name}</span>
      </div>
    </Link>
  );
}
