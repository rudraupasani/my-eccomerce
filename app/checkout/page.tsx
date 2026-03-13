'use client'

import { useCart } from '@/app/context/cart-context'
import { useAuth } from '@/app/context/auth-context'
import { createOrder } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { ScrollAnimate } from '@/components/scroll-animate'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ShieldCheck, 
  ChevronRight, 
  Lock, 
  CreditCard, 
  Truck, 
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
      <div className="bg-background min-h-screen py-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
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
      const orderId = 'LX-' + Math.floor(100000 + Math.random() * 900000)
      const inputEmail = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value
      const customerEmail = (user?.email || inputEmail || 'guest@example.com').toLowerCase()
      
      const orderData = {
        external_id: orderId,
        customer_email: customerEmail,
        total: grandTotal,
        status: 'Processing',
        shipping_address: {
          name: (document.querySelector('input[placeholder="John Doe"]') as HTMLInputElement)?.value || 'Valued Guest',
          address: (document.querySelector('input[placeholder="123 Jewel St."]') as HTMLInputElement)?.value || '',
          city: (document.querySelector('input[placeholder="New York"]') as HTMLInputElement)?.value || '',
          zip: (document.querySelector('input[placeholder="10001"]') as HTMLInputElement)?.value || '',
        },
        estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      }

      await createOrder(orderData, items)

      await clearCart()
      router.push(`/order-confirmation?orderId=${orderId}`)
    } catch (error) {
      console.error("Failed to place order:", error)
      alert("There was an issue processing your order. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  if (items.length === 0) {
    return (
      <div className="container-xl py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/products" className="btn-primary">Browse Collection</Link>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      
      {/* ── Checkout Progress ── */}
      <div className="bg-secondary/30 border-b border-border py-6">
        <div className="container-xl flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
           <span className="text-muted-foreground">Cart</span>
           <ChevronRight className="w-3 h-3 text-border" />
           <span className="text-accent underline underline-offset-4">Checkout</span>
           <ChevronRight className="w-3 h-3 text-border" />
           <span className="text-muted-foreground">Confirmation</span>
        </div>
      </div>

      <div className="container-xl py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
           
           {/* ── Left: Checkout Form ── */}
           <div className="flex-1 w-full space-y-8">
              <ScrollAnimate type="fade-right">
                <div className="flex items-center gap-3 mb-8">
                   <h1 className="text-2xl md:text-3xl mb-0 leading-none">Shipping Details</h1>
                </div>
                
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-10">
                   
                   {/* Personal Info */}
                   <section className="space-y-6">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                         <User className="w-4 h-4" /> Customer Information
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest block ml-1">Email Address</label>
                            <input type="email" required placeholder="name@email.com" className="input-field" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest block ml-1">Phone Number</label>
                            <input type="tel" required placeholder="+1 (555) 000-0000" className="input-field" />
                         </div>
                      </div>
                   </section>

                   {/* Shipping Address */}
                   <section className="space-y-6">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                         <MapPin className="w-4 h-4" /> Shipping Address
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest block ml-1">Full Name</label>
                            <input type="text" required placeholder="John Doe" className="input-field" />
                         </div>
                         <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest block ml-1">Street Address</label>
                            <input type="text" required placeholder="123 Jewel St." className="input-field" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest block ml-1">City</label>
                            <input type="text" required placeholder="New York" className="input-field" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest block ml-1">Postal Code</label>
                            <input type="text" required placeholder="10001" className="input-field" />
                         </div>
                      </div>
                   </section>

                   {/* Payment Method (Placeholder) */}
                   <section className="space-y-6">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                         <CreditCard className="w-4 h-4" /> Payment Method
                      </div>
                      <div className="card p-6 border-accent bg-accent/5">
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                               <CheckCircle2 className="w-5 h-5 text-accent" />
                               <span className="text-sm font-bold">Credit / Debit Card</span>
                            </div>
                            <div className="flex gap-2">
                               <div className="w-8 h-5 bg-muted rounded-sm" />
                               <div className="w-8 h-5 bg-muted rounded-sm" />
                               <div className="w-8 h-5 bg-muted rounded-sm" />
                            </div>
                         </div>
                         <div className="space-y-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-widest block ml-1">Card Number</label>
                               <input type="text" required placeholder="•••• •••• •••• ••••" className="input-field" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-bold uppercase tracking-widest block ml-1">Expiry Date</label>
                                  <input type="text" required placeholder="MM / YY" className="input-field" />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-bold uppercase tracking-widest block ml-1">CVV</label>
                                  <input type="text" required placeholder="•••" className="input-field" />
                               </div>
                            </div>
                         </div>
                      </div>
                   </section>
                </form>
              </ScrollAnimate>
           </div>

           {/* ── Right: Summary Sidebar ── */}
           <aside className="w-full lg:w-[400px] shrink-0 sticky top-32">
              <ScrollAnimate type="fade-left">
                 <div className="card bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 bg-secondary/50 border-b border-border flex items-center justify-between">
                       <h3 className="text-lg font-bold">Order Summary</h3>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{itemsWithDetails.length} Items</span>
                    </div>
                    
                    <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto divide-y divide-border">
                       {itemsWithDetails.map(item => (
                         <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                            <div className="relative w-16 h-16 rounded-lg bg-secondary border border-border overflow-hidden shrink-0">
                               <Image src={item.product!.image_url || '/placeholder.png'} alt={item.product!.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                               <h4 className="text-xs font-bold leading-tight">{item.product!.name}</h4>
                               <p className="text-[10px] text-muted-foreground font-medium mt-1">QTY: {item.quantity}</p>
                               <p className="text-xs font-black text-accent mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="p-6 bg-secondary/30 space-y-3 border-t border-border">
                       <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground font-medium">Shipping</span>
                          <span>{shipping === 0 ? <span className="text-accent uppercase text-[10px] font-bold">Free</span> : `₹${shipping.toLocaleString()}`}</span>
                       </div>
                       <div className="flex justify-between text-xs font-medium pb-3">
                          <span className="text-muted-foreground font-medium">Est. Tax</span>
                          <span className="font-bold">₹{tax.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between pt-3 border-t border-border">
                          <span className="text-base font-bold">Grand Total</span>
                          <span className="text-2xl font-black text-accent">₹{grandTotal.toLocaleString()}</span>
                       </div>
                    </div>

                    <div className="p-6 pt-0 bg-secondary/30">
                       <button 
                          form="checkout-form"
                          type="submit"
                          disabled={loading}
                          className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-xs uppercase"
                       >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                          {loading ? 'Processing Order...' : 'Complete Secure Payment'}
                       </button>
                       <p className="text-[9px] text-center text-muted-foreground font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                          <ShieldCheck className="w-3 h-3 text-accent" /> 
                          SSL Secure Checkout Environment
                       </p>
                    </div>
                 </div>

                 {/* Extra Perks Badge */}
                 <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-card border border-border rounded-xl flex items-center gap-3">
                       <Truck className="w-5 h-5 text-accent" />
                       <div className="text-[9px] font-bold uppercase tracking-widest leading-tight">Fastest Delivery <br/><span className="text-muted-foreground font-medium">In 3-5 Working Days</span></div>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl flex items-center gap-3">
                       <ShieldCheck className="w-5 h-5 text-accent" />
                       <div className="text-[9px] font-bold uppercase tracking-widest leading-tight">Fraud Protection <br/><span className="text-muted-foreground font-medium">Guaranteed Safety</span></div>
                    </div>
                 </div>
              </ScrollAnimate>
           </aside>
        </div>
      </div>
    </div>
  )
}
