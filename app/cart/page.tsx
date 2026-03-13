'use client'

import { useCart } from '@/app/context/cart-context'
import { useAuth } from '@/app/context/auth-context'
import { ScrollAnimate } from '@/components/scroll-animate'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw, Minus, Plus, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()
  const { user } = useAuth()
  const [cartProducts, setCartProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCartProducts() {
      if (items.length === 0) {
        setCartProducts([])
        setLoading(false)
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
        setLoading(false)
      }
    }

    fetchCartProducts()
  }, [items])

  const itemsWithDetails = items.map(item => ({
    ...item,
    product: cartProducts.find(p => p.id === item.productId),
  })).filter(item => item.product)

  const subtotal = total
  const shipping = subtotal > 1000 ? 0 : 99
  const tax = subtotal * 0.08
  const grandTotal = subtotal + shipping + tax

  if (loading) {
    return (
      <div className="bg-background min-h-screen pb-20 pt-40 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pb-20">

      {/* ── Page Header ── */}
      <section className="bg-secondary/30 pt-16 pb-12 border-b border-border">
        <div className="container-xl flex items-center justify-between">
          <ScrollAnimate type="fade-down">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="w-6 h-6 text-accent" />
              <h1 className="text-3xl md:text-4xl mb-0">Shopping Cart</h1>
            </div>
            <p className="text-muted-foreground">
              Review your jewelry selections and checkout
            </p>
          </ScrollAnimate>
          <div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
             <span className="flex items-center gap-1.5"><Truck className="w-4 h-4" /> Free Shipping</span>
             <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Secure SSL</span>
          </div>
        </div>
      </section>

      {/* ── Cart Content ── */}
      <div className="container-xl py-12">
        {itemsWithDetails.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-border text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>Product Details</span>
                <span className="hidden sm:block">Item Total</span>
              </div>
              
              <div className="divide-y divide-border">
                {itemsWithDetails.map(item => (
                  <ScrollAnimate key={item.id} type="fade-up" className="py-8 first:pt-0">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <Link href={`/product/${item.product!.id}`} className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-secondary rounded-lg overflow-hidden group border border-border">
                        <Image
                          src={item.product!.image_url || '/placeholder.png'}
                          alt={item.product!.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link
                              href={`/product/${item.product!.id}`}
                              className="text-lg font-bold hover:text-accent transition leading-tight"
                            >
                              {item.product!.name}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1">SKU: {item.product!.sku}</p>
                          </div>
                          <div className="sm:hidden text-lg font-bold text-accent">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-sm font-semibold text-accent">₹{item.product!.price.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">each</span>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center bg-secondary rounded-lg border border-border p-1">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-md transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-12 text-center text-sm font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-md transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.productId)}
                            className="flex items-center gap-2 text-xs font-bold text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Remove Item</span>
                          </button>
                        </div>
                      </div>

                      {/* Desktop Item Total */}
                      <div className="hidden sm:flex flex-col items-end justify-center min-w-[120px]">
                        <div className="text-2xl font-bold text-accent">
                          ${(item.price * item.quantity).toLocaleString()}
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Line Total</p>
                      </div>
                    </div>
                  </ScrollAnimate>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <Link
                  href="/products"
                  className="btn-secondary w-full sm:w-auto flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
                <div className="flex items-center gap-6 text-xs font-bold text-muted-foreground uppercase">
                  <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3" /> Updates live</span>
                </div>
              </div>
            </div>

            {/* Order Summary Checkout */}
            <div className="lg:col-span-1">
              <ScrollAnimate type="fade-left" className="sticky top-32">
                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                  <h2 className="text-xl mb-8">Order Summary</h2>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Subtotal</span>
                      <span className="font-bold">₹{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Shipping</span>
                      <span className="font-bold">
                        {shipping === 0 ? (
                          <span className="text-accent uppercase text-xs">Free</span>
                        ) : (
                          `₹${shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pb-4 border-b border-border">
                      <span className="text-muted-foreground font-medium">Tax (8%)</span>
                      <span className="font-bold">₹{tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-lg font-bold">Total</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">₹{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">Secure Transaction</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {user ? (
                      <Link
                        href="/checkout"
                        className="btn-primary w-full py-4 text-sm"
                      >
                        Proceed to Secure Checkout
                      </Link>
                    ) : (
                      <Link
                        href="/login?redirect=/cart"
                        className="btn-primary w-full py-4 text-sm"
                      >
                        Login to Checkout
                      </Link>
                    )}
                    <p className="text-[10px] text-muted-foreground text-center px-4 leading-relaxed font-medium">
                      By proceeding, you agree to our Terms of Sale and Privacy Policy. All prices in USD.
                    </p>
                  </div>
                </div>

                {/* Extra Trust Info */}
                <div className="mt-6 flex items-center justify-center gap-6">
                   <div className="flex flex-col items-center">
                     <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-2">
                        <ShieldCheck className="w-5 h-5 text-accent" />
                     </div>
                     <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">Safe Payment</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-2">
                        <Truck className="w-5 h-5 text-accent" />
                     </div>
                     <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">Free Global</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-2">
                        <RefreshCw className="w-5 h-5 text-accent" />
                     </div>
                     <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">Returns Policy</span>
                   </div>
                </div>
              </ScrollAnimate>
            </div>

          </div>
        ) : (
          <ScrollAnimate type="scale-up">
            <div className="text-center py-32 bg-secondary/10 rounded-2xl border-2 border-dashed border-border max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-card shadow-sm border border-border rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Your basket is currently empty</h2>
              <p className="text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
                Before you checkout, you must add some beautiful pieces to your cart.
              </p>
              <Link
                href="/products"
                className="btn-primary px-10 py-4 flex items-center justify-center gap-2 mx-auto w-fit"
              >
                Start Shopping Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollAnimate>
        )}
      </div>
    </div>
  )
}
