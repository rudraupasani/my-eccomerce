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
    <div className="group flex flex-col h-full bg-white border border-zinc-200 transition-all duration-300 hover:border-[#C5A059] hover:shadow-sm">
      
      {/* Product Image Container */}
      <Link 
        href={`/product/${product.id}`} 
        className="block relative aspect-[4/5] overflow-hidden bg-zinc-50"
      >
        <Image
          src={product.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs border border-zinc-200 text-zinc-700 hover:text-[#C5A059] transition-colors rounded-none z-10 cursor-pointer shadow-xs"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C5A059] text-[#C5A059]' : 'text-zinc-600'}`} />
        </button>

        {/* Category Pill Tag */}
        {product.category && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs border border-zinc-200 text-[9px] uppercase tracking-[0.2em] font-semibold text-zinc-800 shadow-xs">
            {product.category}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-xs">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-800 border border-zinc-400 px-3 py-1.5 bg-white">
              Archive Reserved
            </span>
          </div>
        )}
      </Link>

      {/* Info Section */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-base font-normal tracking-wide text-zinc-950 group-hover:text-[#C5A059] transition-colors line-clamp-1 mb-0">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-[#C5A059] text-[#C5A059]' : 'text-zinc-300'}`}
                />
              ))}
            </div>
            {product.reviews ? (
              <span className="text-[10px] text-zinc-500 font-medium">({product.reviews})</span>
            ) : null}
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-light">Price</span>
            <span className="text-base font-serif font-medium text-zinc-950">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className="px-4 py-2 bg-black text-white hover:bg-zinc-800 text-xs font-semibold tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ADD</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  )
}
