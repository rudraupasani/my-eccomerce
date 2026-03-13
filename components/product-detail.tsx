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
    : (Number(product.rating) || 0).toFixed(1)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      
      {/* ── Media Gallery ── */}
      <ScrollAnimate type="fade-right" className="space-y-6">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary border border-border group shadow-sm">
          <Image
            src={product.image_url || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <button 
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-6 right-6 p-3 bg-background/80 backdrop-blur-md rounded-full shadow-sm hover:text-accent transition duration-200 z-10"
          >
            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-accent text-accent' : ''}`} />
          </button>
          {!product.in_stock && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="badge bg-secondary text-foreground py-2 px-4 text-sm">Temporarily Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-secondary border border-border cursor-pointer hover:border-accent transition duration-300">
               <Image src={product.image_url || '/placeholder.png'} alt={product.name} fill className="object-cover opacity-80" />
            </div>
          ))}
        </div>
      </ScrollAnimate>

      {/* ── Product Info ── */}
      <ScrollAnimate type="fade-left" className="flex flex-col">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent font-black tracking-[0.3em] text-[10px] uppercase">{(product as any).categories?.name || product.category}</span>
            <span className="w-1 h-1 bg-accent/20 rounded-full" />
            <span className="text-[10px] font-black text-accent/40 uppercase tracking-[0.3em]">SKU: {product.sku}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-tight text-accent">
            {product.name}
          </h1>
 Broadway font? No, sticking to serif.
          
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-4 py-1.5 px-3 bg-secondary rounded-lg border border-accent/10">
               <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(Number(avgRating)) ? 'fill-accent text-accent' : 'text-accent/10'}`} />
                  ))}
               </div>
               <span className="text-xs font-black text-accent">{avgRating}</span>
            </div>
            <span className="text-[10px] font-black text-accent/50 uppercase tracking-widest underline underline-offset-4 cursor-pointer hover:text-accent transition">
               View {reviews.length} Customer Reviews
            </span>
          </div>

          <div className="text-4xl font-black text-accent mb-8">
            ₹{product.price.toLocaleString()}
          </div>

          <p className="text-accent/60 text-lg leading-relaxed mb-10 max-w-xl">
            {product.description}
          </p>
        </div>

        {/* Configuration / Options (Placeholder) */}
        <div className="space-y-8 mb-12 flex-1">
          <div className="grid grid-cols-2 gap-8 py-8 border-y border-accent/10">
             <div>
                <p className="text-[10px] font-black text-accent/40 uppercase tracking-widest mb-2">Material</p>
                <div className="flex items-center gap-2">
                   <span className="w-4 h-4 rounded-full bg-accent" />
                   <span className="text-sm font-black uppercase tracking-widest text-accent/70">18K Solid Gold</span>
                </div>
             </div>
             <div>
                <p className="text-[10px] font-black text-accent/40 uppercase tracking-widest mb-2">Availability</p>
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-accent' : 'bg-red-500'}`} />
                    <span className="text-sm font-black uppercase tracking-widest text-accent/70">{product.in_stock ? 'Ready to Ship' : 'Backorder'}</span>
                 </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center bg-secondary rounded-xl border border-accent/10 p-1.5 w-full sm:w-auto">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center hover:bg-white rounded-lg transition text-accent"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-14 text-center text-lg font-black text-accent">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 flex items-center justify-center hover:bg-white rounded-lg transition text-accent"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

             <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`flex-1 w-full py-5 px-8 rounded-xl font-black text-xs tracking-[0.3em] uppercase transition-all duration-300 flex items-center justify-center gap-3 ${
                added
                  ? 'bg-accent text-white'
                  : product.in_stock
                  ? 'bg-accent text-white hover:bg-accent/80 shadow-lg shadow-accent/10'
                  : 'bg-muted text-accent/40 cursor-not-allowed opacity-50'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Successfully Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Secure Add to Cart
                </>
              )}
            </button>
          </div>
        </div>

        {/* Benefits Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-border">
          {[
            { icon: Truck, title: 'Free Global', desc: 'Secure Express' },
            { icon: ShieldCheck, title: 'Lifetime', desc: 'Craft Warranty' },
            { icon: RefreshCw, title: '30-Day', desc: 'Easy Returns' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent ring-1 ring-accent/10">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-accent">
                  {item.title}
                </h4>
                <p className="text-[10px] text-accent/40 font-black uppercase tracking-tighter leading-none">
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
