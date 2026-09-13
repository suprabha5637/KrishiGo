'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Valid phone number required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['customer', 'farmer']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'customer' }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    // Mock registration
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
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
          <h1 className="text-2xl font-bold text-foreground mb-1">Join <span className="text-primary">Krishi</span><span className="text-amber-500">Go</span></h1>
          <p className="text-muted-foreground text-sm">Create your account to start shopping farm-fresh.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input {...register('name')} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input type="tel" {...register('phone')} />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" {...register('password')} />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">I am a</label>
            <select 
              {...register('role')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="text-primary font-medium hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
