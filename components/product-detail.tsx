'use client'

import { Product, Review } from '@/lib/types'
import { useCart } from '@/app/context/cart-context'
import { useWishlist } from '@/app/context/wishlist-context'
import { Star, Check, Truck, ShieldCheck, RefreshCw, Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { ScrollAnimate } from './scroll-animate'

interface ProductDetailProps {
  product: Product
  reviews: Review[]
}

export function ProductDetail({ product, reviews }: ProductDetailProps) {
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product.id, product.price, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : (Number(product.rating) || 5).toFixed(1)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 text-zinc-900">
      
      {/* ── Media Gallery ── */}
      <ScrollAnimate type="fade-right" className="space-y-4">
        <div className="relative aspect-square overflow-hidden bg-zinc-50 border border-zinc-200">
          <Image
            src={product.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&q=80'}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          <button 
            onClick={() => toggleWishlist(product.id)}
            aria-label="Toggle wishlist"
            className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-xs border border-zinc-200 text-zinc-700 hover:text-[#C5A059] transition-colors z-10 cursor-pointer shadow-xs"
          >
            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-[#C5A059] text-[#C5A059]' : 'text-zinc-600'}`} />
          </button>
          {!product.in_stock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-xs">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-800 border border-zinc-400 px-5 py-2 bg-white">
                Archive Backordered
              </span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-zinc-50 border border-zinc-200 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <Image 
                src={product.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80'} 
                alt={product.name} 
                fill 
                className="object-cover" 
              />
            </div>
          ))}
        </div>
      </ScrollAnimate>

      {/* ── Product Info ── */}
      <ScrollAnimate type="fade-left" className="flex flex-col">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[#C5A059] tracking-[0.25em] text-[10px] uppercase font-semibold">
              {(product as any).categories?.name || product.category || 'Fine Jewelry'}
            </span>
            <span className="w-1 h-1 bg-zinc-300 rounded-full" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
              SKU: {product.sku || 'LUM-8820'}
            </span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight mb-3 text-zinc-950">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(Number(avgRating)) ? 'fill-[#C5A059] text-[#C5A059]' : 'text-zinc-300'}`} />
              ))}
            </div>
            <span className="text-xs text-zinc-500 font-light">
              {avgRating} ({reviews.length} Collector Reviews)
            </span>
          </div>

          <div className="text-3xl font-serif font-medium text-zinc-950 mb-5">
            ₹{product.price.toLocaleString()}
          </div>

          <p className="text-zinc-600 font-light text-sm leading-relaxed mb-6 max-w-xl">
            {product.description || 'Crafted with peerless precision from ethically sourced gemstones and pure solid metals. Designed to elevate every moment with quiet distinction.'}
          </p>
        </div>

        {/* Configuration / Options */}
        <div className="space-y-6 mb-8 flex-1">
          <div className="grid grid-cols-2 gap-6 py-5 border-y border-zinc-200">
            <div>
              <p className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-widest mb-1">Material & Bench</p>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
                <span className="text-xs uppercase tracking-wider text-zinc-800 font-medium">18K Solid Gold</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-widest mb-1">Atelier Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${product.in_stock ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-xs uppercase tracking-wider text-zinc-800 font-medium">
                  {product.in_stock ? 'In Stock & Ready' : 'Bespoke Order'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center bg-zinc-50 border border-zinc-300 p-1 w-full sm:w-auto">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-black transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-semibold text-zinc-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-black transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`flex-1 w-full py-3.5 px-8 font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer ${
                added
                  ? 'bg-[#C5A059] text-black'
                  : product.in_stock
                  ? 'bg-black text-white hover:bg-zinc-800'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Added To Luméa Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quiet Luxury Service Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-200">
          {[
            { icon: Truck, title: 'Courier Express', desc: 'Secure White Glove' },
            { icon: ShieldCheck, title: 'Gem Certificate', desc: 'GIA / Heritage Spec' },
            { icon: RefreshCw, title: 'Private Returns', desc: '30-Day Evaluation' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200">
              <div className="w-8 h-8 bg-white border border-zinc-200 flex items-center justify-center text-[#C5A059] shrink-0">
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-900 mb-0.5">
                  {item.title}
                </h4>
                <p className="text-[10px] text-zinc-500 font-light">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollAnimate>
    </div>
  )
}
