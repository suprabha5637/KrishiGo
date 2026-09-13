'use client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        {user ? (
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="mt-2">Role: {user.role}</p>
            <Button onClick={logout} variant="outline" className="mt-6">Logout</Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p>Please login to view your profile.</p>
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
