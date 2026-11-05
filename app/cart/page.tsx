'use client'

import { useCart } from '@/app/context/cart-context'
import { useAuth } from '@/app/context/auth-context'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Truck, Minus, Plus, Loader2 } from 'lucide-react'
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
      <div className="bg-white min-h-[60vh] py-24 flex items-center justify-center text-zinc-900">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pb-20 text-zinc-900">

      {/* ── Page Header (Clean spacing, no massive upper gap) ── */}
      <section className="bg-zinc-50 border-b border-zinc-200 py-8">
        <div className="container-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-semibold">✦ Bag Summary</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-zinc-950 mb-0">Your Luméa Bag</h1>
            <p className="text-xs text-zinc-500 font-light mt-1">
              Complimentary insured global courier included on all creations.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-zinc-600">
             <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#C5A059]" /> White Glove Courier</span>
             <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#C5A059]" /> Fully Insured</span>
          </div>
        </div>
      </section>

      {/* ── Cart Content ── */}
      <div className="container-xl py-10">
        {itemsWithDetails.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 text-xs uppercase tracking-widest text-zinc-500 font-medium">
                <span>Selected Pieces</span>
                <span className="hidden sm:block">Total</span>
              </div>
              
              <div className="divide-y divide-zinc-200">
                {itemsWithDetails.map(item => (
                  <div key={item.id} className="py-6 first:pt-0">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <Link href={`/product/${item.product!.id}`} className="relative w-24 h-28 sm:w-28 sm:h-32 shrink-0 bg-zinc-50 border border-zinc-200 overflow-hidden">
                        <Image
                          src={item.product!.image_url || '/placeholder.png'}
                          alt={item.product!.name}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <Link
                              href={`/product/${item.product!.id}`}
                              className="font-serif text-base text-zinc-950 hover:text-[#C5A059] transition leading-snug font-medium"
                            >
                              {item.product!.name}
                            </Link>
                            <div className="sm:hidden text-base font-serif text-zinc-950">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-mono">SKU: {item.product!.sku || 'LUM-SPEC'}</p>
                          <p className="text-xs text-[#C5A059] font-medium mt-1">₹{item.product!.price.toLocaleString()} each</p>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center bg-zinc-50 border border-zinc-200 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-black transition cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-zinc-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-black transition cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.productId)}
                            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Desktop Item Total */}
                      <div className="hidden sm:flex flex-col items-end justify-center min-w-[120px]">
                        <div className="text-lg font-serif text-zinc-950 font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-700 hover:text-black transition-colors font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Continue Browsing
                </Link>
              </div>
            </div>

            {/* Order Summary Checkout */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-50 border border-zinc-200 p-6 sm:p-8 space-y-6 sticky top-28 shadow-xs">
                <h2 className="font-serif text-2xl font-normal text-zinc-950 mb-0">Order Summary</h2>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="text-zinc-950 font-medium">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-zinc-950 font-medium">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Insured Delivery</span>
                    <span className="text-emerald-600 font-medium">Complimentary</span>
                  </div>
                  <div className="pt-4 border-t border-zinc-200 flex justify-between items-center text-sm">
                    <span className="font-medium text-zinc-900 uppercase tracking-wider text-xs">Total Due</span>
                    <span className="font-serif text-2xl text-zinc-950 font-semibold">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <Link
                  href={user ? '/checkout' : '/login?redirect=/checkout'}
                  className="w-full py-3.5 bg-black text-white hover:bg-zinc-800 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-sm block text-center"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="text-[11px] text-zinc-500 text-center font-light leading-relaxed">
                  Every order includes signature presentation packaging, certified provenance documentation, and white-glove insured delivery.
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-50 border border-zinc-200 space-y-5 max-w-xl mx-auto p-8">
            <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto" />
            <h2 className="text-2xl font-serif font-light text-zinc-950">Your Luméa bag is empty</h2>
            <p className="text-xs text-zinc-500 font-light max-w-sm mx-auto">
              Explore our fine jewelry archives to select your next signature heirloom.
            </p>
            <Link
              href="/products"
              className="inline-block bg-black text-white hover:bg-zinc-800 px-8 py-3 text-xs font-semibold tracking-wider transition-colors shadow-xs"
            >
              Discover The Collection
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}
