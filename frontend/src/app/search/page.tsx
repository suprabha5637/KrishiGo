import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        <div className="text-center py-12 text-muted-foreground">
          Enter a search query to find products.
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
