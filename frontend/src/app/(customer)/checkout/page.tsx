"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, MapPin, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone required'),
  addressLine1: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Valid Pincode required'),
  paymentMethod: z.enum(['card', 'upi', 'cod']),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { items, getTotals, clearCart } = useCartStore();
  const { total, subtotal, deliveryFee } = getTotals();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isValid }, watch, trigger } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      paymentMethod: 'card'
    }
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const orderPayload = {
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.variant.price
        })),
        deliveryAddress: {
          fullName: data.fullName,
          phone: data.phone,
          addressLine1: data.addressLine1,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        },
        paymentMethod: data.paymentMethod,
        subtotal,
        deliveryFee,
        total
      };
      
      await api.post('/orders', orderPayload);
      clearCart();
      router.push('/orders?success=true');
    } catch (error) {
      console.error("Failed to place order", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const nextStep = async (currentStep: 1 | 2) => {
    if (currentStep === 1) {
      const isStepValid = await trigger(['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode']);
      if (isStepValid) setStep(2);
    } else if (currentStep === 2) {
      const isStepValid = await trigger(['paymentMethod']);
      if (isStepValid) setStep(3);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
        
        {[
          { num: 1, label: 'Delivery', icon: MapPin },
          { num: 2, label: 'Payment', icon: CreditCard },
          { num: 3, label: 'Review', icon: ShoppingBag }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center bg-background px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors duration-300 border-2
              ${step > s.num ? 'bg-primary border-primary text-white' : step === s.num ? 'bg-primary border-primary text-white' : 'bg-card border-muted text-muted-foreground'}`}>
              {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
            </div>
            <span className={`text-xs font-medium ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold border-b pb-2">Delivery Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <Input {...register('fullName')} placeholder="John Doe" />
                  {errors.fullName && <span className="text-xs text-destructive">{errors.fullName.message}</span>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone Number</label>
                  <Input {...register('phone')} placeholder="+91 9876543210" />
                  {errors.phone && <span className="text-xs text-destructive">{errors.phone.message}</span>}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Address Line 1</label>
                  <Input {...register('addressLine1')} placeholder="House/Flat No., Street Name" />
                  {errors.addressLine1 && <span className="text-xs text-destructive">{errors.addressLine1.message}</span>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">City</label>
                  <Input {...register('city')} placeholder="Mumbai" />
                  {errors.city && <span className="text-xs text-destructive">{errors.city.message}</span>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">State</label>
                  <Input {...register('state')} placeholder="Maharashtra" />
                  {errors.state && <span className="text-xs text-destructive">{errors.state.message}</span>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Pincode</label>
                  <Input {...register('pincode')} placeholder="400001" />
                  {errors.pincode && <span className="text-xs text-destructive">{errors.pincode.message}</span>}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="button" onClick={() => nextStep(1)}>Continue to Payment</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold border-b pb-2">Payment Method</h2>
              <div className="space-y-4">
                {['card', 'upi', 'cod'].map((method) => (
                  <label key={method} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === method ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}>
                    <input type="radio" value={method} {...register('paymentMethod')} className="w-5 h-5 accent-primary" />
                    <div className="capitalize font-medium">
                      {method === 'card' ? 'Credit / Debit Card' : method === 'upi' ? 'UPI' : 'Cash on Delivery'}
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="button" onClick={() => nextStep(2)}>Review Order</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold border-b pb-2">Review & Place Order</h2>
              
              <div className="bg-muted rounded-xl p-4 mb-6">
                <div className="flex justify-between font-bold text-lg mb-2">
                  <span>Total Amount to Pay</span>
                  <span className="text-primary">₹{total}</span>
                </div>
                <p className="text-sm text-muted-foreground">Payment Method: <span className="uppercase">{watch('paymentMethod')}</span></p>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button type="submit" size="lg" disabled={!isValid} className="w-48">Place Order</Button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
