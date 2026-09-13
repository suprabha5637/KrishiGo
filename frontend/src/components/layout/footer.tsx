import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-secondary/30 pt-12 pb-24 md:pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="KrishiGo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="text-2xl font-bold text-primary">Krishi<span className="text-amber-500">Go</span></span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Fresh from Farms. Faster to You. Empowering farmers and delivering quality to consumers.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products?category=vegetables" className="hover:text-primary transition-colors">Vegetables</Link></li>
              <li><Link href="/products?category=fruits" className="hover:text-primary transition-colors">Fruits</Link></li>
              <li><Link href="/products?category=dairy" className="hover:text-primary transition-colors">Dairy & Eggs</Link></li>
              <li><Link href="/products?category=organic" className="hover:text-primary transition-colors">Organic</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/farmer-partners" className="hover:text-primary transition-colors">Partner with us (Farmers)</Link></li>
              <li><Link href="/bulk-order" className="hover:text-primary transition-colors">Bulk Orders</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} KrishiGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
