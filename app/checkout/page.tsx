'use client'

import { useCart } from '@/app/context/cart-context'
import { useAuth } from '@/app/context/auth-context'
import { createOrder } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ShieldCheck, 
  ChevronRight, 
  Lock, 
  CreditCard, 
  User, 
  MapPin,
  CheckCircle2,
  Loader2
} from 'lucide-react'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [cartProducts, setCartProducts] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout')
      return
    }
  }, [user, router])

  useEffect(() => {
    async function fetchCartProducts() {
      if (items.length === 0) {
        setCartProducts([])
        setProductsLoading(false)
        return
      }

      try {
        const productIds = items.map(item => item.productId)
        const { data } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds)
        
        if (data) {
          setCartProducts(data)
        }
      } catch (error) {
        console.error("Error fetching cart products:", error)
      } finally {
        setProductsLoading(false)
      }
    }

    fetchCartProducts()
  }, [items])

  const itemsWithDetails = items.map(item => ({
    ...item,
    product: cartProducts.find(p => p.id === item.productId),
  })).filter(item => item.product)

  if (productsLoading) {
    return (
      <div className="bg-white min-h-[60vh] py-24 flex items-center justify-center text-zinc-900">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
      </div>
    )
  }

  const subtotal = total
  const shipping = subtotal > 1000 ? 0 : 99
  const tax = subtotal * 0.08
  const grandTotal = subtotal + shipping + tax

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderId = 'LUM-' + Math.floor(100000 + Math.random() * 900000)
      const inputEmail = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value
      const customerEmail = (user?.email || inputEmail || 'collector@lumea.com').toLowerCase()
      const customerPhone = (document.querySelector('input[type="tel"]') as HTMLInputElement)?.value || ''
      const customerName = (document.querySelector('input[placeholder="Eleanor Vance"]') as HTMLInputElement)?.value || 'Valued Collector'
      
      const shippingAddress = {
        name: customerName,
        address: (document.querySelector('input[placeholder="Boutique Address / Residence"]') as HTMLInputElement)?.value || '',
        city: (document.querySelector('input[placeholder="Geneva / Mumbai"]') as HTMLInputElement)?.value || '',
        zip: (document.querySelector('input[placeholder="400001"]') as HTMLInputElement)?.value || '',
      }

      // Step 1: Create Razorpay Order on Server
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          currency: 'INR',
          receipt: orderId,
        }),
      })

      const razorpayOrder = await res.json()

      if (!res.ok || !razorpayOrder.id) {
        throw new Error(razorpayOrder.error || 'Failed to initiate checkout gateway')
      }

      // Step 2: Configure Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Luméa High Fine Jewelry',
        description: `Salon Acquisition #${orderId}`,
        image: '/icon.svg',
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // Verify payment on server
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyRes.json()

            if (!verifyRes.ok || !verifyData.verified) {
              throw new Error('Payment signature verification failed')
            }

            // Step 3: Save order to Supabase
            const order = await createOrder({
              customer_email: customerEmail,
              total: grandTotal,
              shipping_address: shippingAddress,
              status: 'Confirmed',
              external_id: orderId,
              items: itemsWithDetails.map(item => ({
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            })

            clearCart()
            router.push(`/order-confirmation?orderId=${orderId}`)
          } catch (err: any) {
            console.error("Order completion failed:", err)
            alert("Payment processed, but order creation encountered an issue. Please contact Luméa salon concierge.")
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#C5A059',
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error: any) {
      console.error("Failed to place order:", error)
      alert(error?.message || "There was an issue processing your payment. Please try again.")
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-xl py-24 text-center text-zinc-900 bg-white min-h-[60vh]">
        <h2 className="text-2xl font-serif mb-4">Your Luméa bag is empty</h2>
        <Link href="/products" className="inline-block bg-black text-white px-8 py-3 text-xs font-semibold tracking-wider">
          Explore Archive
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pb-20 text-zinc-900">
      
      {/* ── Checkout Progress (Clean spacing) ── */}
      <div className="bg-zinc-50 border-b border-zinc-200 py-4">
        <div className="container-xl flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.25em]">
           <span className="text-zinc-500">1. Luméa Bag</span>
           <ChevronRight className="w-3 h-3 text-zinc-400" />
           <span className="text-[#C5A059] font-semibold">2. Secure Acquisition</span>
           <ChevronRight className="w-3 h-3 text-zinc-400" />
           <span className="text-zinc-400">3. Confirmation</span>
        </div>
      </div>

      <div className="container-xl py-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
           
           {/* ── Left: Checkout Form ── */}
           <div className="flex-1 w-full space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="font-serif text-3xl sm:text-4xl text-zinc-950 font-normal leading-none mb-0">
                   Client & Delivery Particulars
                 </h1>
              </div>
              
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                 
                 {/* Personal Info */}
                 <section className="bg-zinc-50/60 border border-zinc-200 p-6 sm:p-7 space-y-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A059] font-semibold">
                       <User className="w-4 h-4" />
                       <span>Collector Information</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-600 block font-medium">Email Address</label>
                          <input 
                            type="email" 
                            required 
                            defaultValue={user?.email || ''}
                            placeholder="collector@lumea.com" 
                            className="w-full px-4 py-2.5 bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#C5A059]" 
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-600 block font-medium">Phone Number</label>
                          <input 
                            type="tel" 
                            required 
                            placeholder="+91 98765 43210" 
                            className="w-full px-4 py-2.5 bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#C5A059]" 
                          />
                       </div>
                    </div>
                 </section>

                 {/* Shipping Address */}
                 <section className="bg-zinc-50/60 border border-zinc-200 p-6 sm:p-7 space-y-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A059] font-semibold">
                       <MapPin className="w-4 h-4" />
                       <span>Private Vault / Delivery Destination</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="md:col-span-2 space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-600 block font-medium">Recipient Full Name</label>
                          <input 
                            type="text" 
                            required 
                            defaultValue={user?.user_metadata?.full_name || ''}
                            placeholder="Eleanor Vance" 
                            className="w-full px-4 py-2.5 bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#C5A059]" 
                          />
                       </div>
                       <div className="md:col-span-2 space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-600 block font-medium">Residence / Address</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="Boutique Address / Residence" 
                            className="w-full px-4 py-2.5 bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#C5A059]" 
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-600 block font-medium">City</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="Geneva / Mumbai" 
                            className="w-full px-4 py-2.5 bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#C5A059]" 
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-600 block font-medium">Postal Code</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="400001" 
                            className="w-full px-4 py-2.5 bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#C5A059]" 
                          />
                       </div>
                    </div>
                 </section>

                 {/* Razorpay Gateway Notice */}
                 <section className="bg-zinc-50/60 border border-zinc-200 p-6 sm:p-7 space-y-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A059] font-semibold">
                       <CreditCard className="w-4 h-4" />
                       <span>Encrypted Payment Processing</span>
                    </div>
                    <div className="p-4 border border-zinc-200 bg-white flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
                          <div>
                              <span className="text-xs font-semibold text-zinc-900 block">Razorpay White Glove Gateway</span>
                              <span className="text-[11px] text-zinc-500">UPI, NetBanking, All Major International & Domestic Cards</span>
                          </div>
                       </div>
                       <span className="text-[10px] uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-semibold">
                         TLS 1.3
                       </span>
                    </div>
                 </section>
              </form>
           </div>

           {/* ── Right: Summary Sidebar ── */}
           <aside className="w-full lg:w-[380px] shrink-0 sticky top-28">
              <div className="bg-zinc-50 border border-zinc-200 p-6 sm:p-7 space-y-5 shadow-xs">
                 <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                    <h3 className="font-serif text-xl font-normal text-zinc-950 mb-0">Acquisition Summary</h3>
                    <span className="text-xs text-zinc-500">{itemsWithDetails.length} Pieces</span>
                 </div>
                 
                 <div className="space-y-3.5 max-h-[300px] overflow-y-auto divide-y divide-zinc-200 pr-1">
                    {itemsWithDetails.map(item => (
                      <div key={item.id} className="flex gap-4 pt-3.5 first:pt-0">
                         <div className="relative w-14 h-16 bg-white border border-zinc-200 overflow-hidden shrink-0">
                            <Image src={item.product!.image_url || '/placeholder.png'} alt={item.product!.name} fill className="object-cover" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-xs text-zinc-950 truncate font-medium">{item.product!.name}</h4>
                            <p className="text-[10px] text-zinc-500">Qty: {item.quantity}</p>
                            <p className="text-xs font-serif text-zinc-900 font-medium mt-0.5">₹{(item.price * item.quantity).toLocaleString()}</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="pt-3 border-t border-zinc-200 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-600">
                       <span>Subtotal</span>
                       <span className="text-zinc-900 font-medium">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                       <span>Insured White Glove Courier</span>
                       <span className="text-emerald-700 font-medium">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 pb-2">
                       <span>Estimated Tax (8%)</span>
                       <span className="text-zinc-900 font-medium">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-zinc-200 items-center">
                       <span className="text-xs uppercase tracking-wider font-semibold text-zinc-900">Total Valuation</span>
                       <span className="font-serif text-2xl text-zinc-950 font-bold">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                 </div>

                 <button 
                    form="checkout-form"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-black text-white hover:bg-zinc-800 text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                 >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    <span>{loading ? 'Authorizing Gateway…' : 'Authorize Acquisition'}</span>
                 </button>

                 <div className="text-[10px] text-zinc-500 text-center font-light leading-relaxed flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>256-Bit Bank Grade Encryption</span>
                 </div>
              </div>
           </aside>
        </div>
      </div>
    </div>
  )
}
