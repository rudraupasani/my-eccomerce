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
    <div className="group card-premium flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-secondary rounded-t-xl m-0">
        <Image
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm border border-border rounded-full hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 z-10 shadow-lg"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-accent' : 'text-muted-foreground'}`} />
        </button>

        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-white border border-white px-4 py-2 rounded-lg">Sold Out</span>
          </div>
        )}
      </Link>

      <div className="p-6 md:p-7 flex flex-col flex-1 gap-5">
        <div>
          <Link href={`/product/${product.id}`} className="hover:text-accent transition-colors group/title">
            <h3 className="text-base md:text-lg font-bold tracking-tight leading-tight text-foreground group-hover/title:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="h-0.5 w-8 bg-accent mt-3 group-hover:w-12 transition-all" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-accent/20'}`}
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground">({product.reviews})</span>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl md:text-3xl font-bold text-foreground">
              ₹{product.price.toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className="w-full py-3 px-4 text-xs md:text-sm font-bold tracking-wider uppercase rounded-lg bg-accent text-white hover:bg-accent/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            {added ? 'ADDED' : 'ADD TO BAG'}
          </button>
        </div>
      </div>
    </div>
  )
}
