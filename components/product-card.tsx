'use client'

import { Product } from '@/lib/types'
import { useCart } from '@/app/context/cart-context'
import { useWishlist } from '@/app/context/wishlist-context'
import { Star, ShoppingBag, Check, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product.id, product.price, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const isWishlisted = isInWishlist(product.id)
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  return (
    <div className="group card-premium flex flex-col h-full bg-white overflow-hidden">
      <Link href={`/product/${product.id}`} className="block relative aspect-4/5 overflow-hidden bg-secondary m-2 rounded-xl">
        <Image
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover contrast-[1.1] transition-all duration-1000 group-hover:scale-105"
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-3 bg-white border border-accent/20 rounded-full hover:border-accent transition duration-300 z-10"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-accent text-accent' : 'text-accent/20'}`} />
        </button>

        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent border-2 border-accent px-6 py-3 rounded-full">Archive</span>
          </div>
        )}

        {/* Quick Add Overlay Removed in favor of persistent button */}
      </Link>

      <div className="p-8 flex flex-col flex-1">
        <div className="mb-6">
          <Link href={`/product/${product.id}`} className="hover:text-accent transition-colors">
            <h3 className="text-lg font-black tracking-tight leading-tight uppercase text-accent/90">
              {product.name}
            </h3>
          </Link>
          <div className="h-px w-12 bg-accent mt-4" />
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-accent text-accent'
                    : 'text-accent/10'
                }`}
              />
            ))}
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-accent/30">{product.reviews} COLLECTORS</span>
        </div>

        <div className="mt-auto flex flex-col gap-6">
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black font-sans leading-none text-accent">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent/40 italic">Private Sale</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className="w-full btn-primary py-4 text-[10px] font-black tracking-[0.3em] rounded-xl bg-accent text-white hover:bg-accent/80 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            {added ? 'ADDED' : 'ADD TO BAG'}
          </button>
        </div>
      </div>
    </div>
  )
}
