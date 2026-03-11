'use client'

import { useSearchParams } from 'next/navigation'
import { ScrollAnimate } from '@/components/scroll-animate'
import Link from 'next/link'
import { Suspense } from 'react'
import {
   CheckCircle2,
   ArrowRight,
   Package,
   Truck,
   Mail,
   ArrowLeft,
   ShoppingBag,
   Gem
} from 'lucide-react'

function OrderConfirmationContent() {
   const searchParams = useSearchParams()
   const orderId = searchParams.get('orderId') || 'LX-' + Math.floor(100000 + Math.random() * 900000)

   return (
      <div className="bg-background min-h-screen py-10 flex items-center justify-center">
         <div className="container-xl max-w-2xl px-4">

            <ScrollAnimate type="scale-up" className="bg-card border border-border p-10 md:p-16 rounded-3xl shadow-sm text-center relative overflow-hidden">

               {/* Abstract background element */}
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Gem className="w-64 h-64 -mr-20 -mt-20 rotate-12" />
               </div>

               <div className="relative z-10 flex flex-col items-center">

                  <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-10 border-4 border-accent/20">
                     <CheckCircle2 className="w-12 h-12 text-accent" />
                  </div>

                  <span className="text-accent font-bold tracking-[0.2em] text-[10px] uppercase mb-4">Success! Order Verified</span>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Your order has <br /> been placed.</h1>

                  <p className="text-muted-foreground text-lg mb-12 max-w-sm mx-auto leading-relaxed">
                     Thank you for your purchase. We&apos;ve sent a summary to your email address.
                     Your luxury pieces are being prepared for delivery.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-12">
                     <div className="p-6 bg-secondary rounded-2xl border border-border text-left">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Order Tracking ID</p>
                        <p className="font-black text-xl text-accent tracking-tighter">{orderId}</p>
                     </div>
                     <div className="p-6 bg-secondary rounded-2xl border border-border text-left">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Est. Delivery</p>
                        <p className="font-bold text-xl uppercase tracking-tighter">March 14 - 16</p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                     <Link href="/products" className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                        Continue Shopping
                        <ArrowRight className="w-4 h-4" />
                     </Link>
                     <Link href="/orders" className="btn-secondary flex-1 py-4 flex items-center justify-center gap-2">
                        <Package className="w-4 h-4" />
                        View Orders
                     </Link>
                  </div>

                  <div className="mt-16 flex items-center gap-10 pt-10 border-t border-border w-full justify-center">
                     <div className="flex flex-col items-center gap-2">
                        <Truck className="w-5 h-5 text-muted-foreground" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Logistics</span>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Email Confirmation</span>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Tax Invoice</span>
                     </div>
                  </div>

               </div>
            </ScrollAnimate>

            <Link href="/" className="mt-12 group flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors">
               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
               Back to Home
            </Link>
         </div>
      </div>
   )
}

export default function OrderConfirmationPage() {
   return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div></div>}>
         <OrderConfirmationContent />
      </Suspense>
   )
}
