'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg border p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold text-primary">Krishi<span className="text-accent">Go</span></span>
          </Link>
          <h2 className="text-xl font-semibold mt-4">Reset Password</h2>
          <p className="text-muted-foreground mt-2">Enter your email and we'll send you a reset link.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>

          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-primary font-medium hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
