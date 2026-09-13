import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Truck, Tag, Heart } from 'lucide-react';
import { CategoryCard } from '@/components/shared/category-card';
import { ProductCard } from '@/components/shared/product-card';
import { CATEGORIES } from '@/constants';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1', name: 'Farm Fresh Tomatoes', slug: 'tomatoes', description: 'Fresh red tomatoes',
    categoryId: '1', unit: '1 kg', images: [], isOrganic: true, isQuickDelivery: true, rating: 4.8, reviewsCount: 124,
    variants: [{ id: 'v1', quality: 'Premium', price: 40, originalPrice: 50, stock: 100, sku: 'TOM-P' }]
  },
  {
    id: '2', name: 'Red Onions', slug: 'onions', description: 'Fresh red onions',
    categoryId: '1', unit: '1 kg', images: [], isOrganic: false, isQuickDelivery: true, rating: 4.5, reviewsCount: 89,
    variants: [{ id: 'v2', quality: 'Standard', price: 35, stock: 200, sku: 'ONI-S' }]
  },
  {
    id: '3', name: 'Potatoes', slug: 'potatoes', description: 'Fresh potatoes',
    categoryId: '1', unit: '1 kg', images: [], isOrganic: false, isQuickDelivery: true, rating: 4.6, reviewsCount: 156,
    variants: [{ id: 'v3', quality: 'Standard', price: 30, stock: 150, sku: 'POT-S' }]
  },
  {
    id: '4', name: 'Fresh Bananas (Robusta)', slug: 'bananas', description: 'Fresh bananas',
    categoryId: '2', unit: '1 dozen', images: [], isOrganic: true, isQuickDelivery: true, rating: 4.9, reviewsCount: 210,
    variants: [{ id: 'v4', quality: 'Premium', price: 50, stock: 80, sku: 'BAN-P' }]
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pb-16 md:pb-0">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                Fresh from Farms.<br />
                <span className="text-primary">Faster to You.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Good for you. Great for farmers. Get farm-fresh produce delivered to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                    Shop Fresh Produce
                  </Button>
                </Link>
                <Link href="/bulk-order">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                    Bulk Orders
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full flex justify-center">
              <div className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/hero-banner.png"
                  alt="Fresh farm produce - vegetables and fruits from Indian farms"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="border-y bg-muted/30 py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <Leaf className="h-8 w-8 text-primary" />
                <span className="font-medium text-sm">Farm Fresh</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Truck className="h-8 w-8 text-primary" />
                <span className="font-medium text-sm">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Tag className="h-8 w-8 text-primary" />
                <span className="font-medium text-sm">Better Prices</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Heart className="h-8 w-8 text-primary" />
                <span className="font-medium text-sm">Support Farmers</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 container mx-auto px-4">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Link href="/products" className="text-primary text-sm font-medium hover:underline flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
            {CATEGORIES.map(category => (
              <CategoryCard key={category.id} category={category as any} />
            ))}
          </div>
        </section>

        {/* Fresh Deals */}
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Fresh Deals Today</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {mockProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Bulk Banner */}
        <section className="py-12 container mx-auto px-4">
          <div className="bg-amber-100 dark:bg-amber-900/20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-500">Need in Bulk?</h2>
              <p className="text-amber-800/80 dark:text-amber-200/80 text-lg">
                Planning a wedding, running a restaurant, or organizing an event? Get special pricing on wholesale orders directly from farmers.
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Request a Bulk Quote
              </Button>
            </div>
            <div className="hidden md:block">
              <div className="w-48 h-48 rounded-full bg-amber-200 dark:bg-amber-800/50 flex items-center justify-center">
                <Truck className="w-24 h-24 text-amber-600" />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
