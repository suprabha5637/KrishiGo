'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Mock login
    setTimeout(() => {
      login(
        { id: '1', name: 'Test User', email: data.email, phone: '9876543210', role: 'customer' },
        'mock-jwt-token'
      );
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg border p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Image
              src="/logo.png"
              alt="KrishiGo"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-1">Welcome to <span className="text-primary">Krishi</span><span className="text-amber-500">Go</span></h1>
          <p className="text-muted-foreground text-sm">Sign in to access farm-fresh produce and more.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input 
              type="email" 
              placeholder="you@example.com" 
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input 
              type="password" 
              placeholder="••••••••" 
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/register" className="text-primary font-medium hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
