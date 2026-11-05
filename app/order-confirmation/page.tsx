'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import {
   CheckCircle2,
   ArrowRight,
   Package
} from 'lucide-react'

function OrderConfirmationContent() {
   const searchParams = useSearchParams()
   const orderId = searchParams.get('orderId') || 'LUM-' + Math.floor(100000 + Math.random() * 900000)
   const paymentId = searchParams.get('paymentId')

   return (
      <div className="bg-white min-h-[75vh] py-12 flex items-center justify-center text-zinc-900">
         <div className="container-xl max-w-2xl px-4">

            <div className="bg-zinc-50 border border-zinc-200 p-8 sm:p-12 text-center relative overflow-hidden shadow-xs">
               <div className="relative z-10 flex flex-col items-center space-y-5">

                  <div className="w-16 h-16 bg-white border border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-xs">
                     <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                     <span className="text-[#C5A059] text-xs uppercase tracking-[0.25em] font-semibold block mb-2">
                        ✦ Acquisition Confirmed
                     </span>
                     <h1 className="font-serif text-3xl sm:text-4xl text-zinc-950 font-normal mb-0">
                        Your Creation Has Been Reserved
                     </h1>
                     <p className="text-xs text-zinc-600 font-light mt-2 max-w-md mx-auto leading-relaxed">
                        An email receipt and certificate itinerary have been dispatched. Your bespoke piece is being prepared for insured courier shipment.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left pt-2">
                     <div className="p-4 bg-white border border-zinc-200">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-medium">Acquisition Reference</p>
                        <p className="font-mono text-sm text-zinc-900 font-semibold">{orderId}</p>
                     </div>
                     <div className="p-4 bg-white border border-zinc-200">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-medium">Payment Verification</p>
                        <p className="font-mono text-xs text-zinc-800 truncate font-medium">{paymentId || 'Verified Instant (Razorpay)'}</p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                     <Link 
                        href="/products" 
                        className="flex-1 py-3.5 bg-black text-white hover:bg-zinc-800 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
                     >
                        <span>Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                     </Link>
                     <Link 
                        href="/orders" 
                        className="flex-1 py-3.5 bg-white border border-zinc-300 text-zinc-900 hover:border-black text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
                     >
                        <Package className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>View Orders</span>
                     </Link>
                  </div>

               </div>
            </div>

         </div>
      </div>
   )
}

export default function OrderConfirmationPage() {
   return (
      <Suspense fallback={<div className="bg-white min-h-[60vh] py-20 text-center text-zinc-900">Loading confirmation…</div>}>
         <OrderConfirmationContent />
      </Suspense>
   )
}
