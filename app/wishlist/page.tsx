'use client'

import { ScrollAnimate } from '@/components/scroll-animate'
import { ProductCard } from '@/components/product-card'
import { useWishlist } from '@/app/context/wishlist-context'
import { Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function WishlistPage() {
  const { wishlist, loading: wishlistLoading } = useWishlist()
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (wishlist.length === 0) {
        setWishlistProducts([])
        setLoading(false)
        return
      }

      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .in('id', wishlist)
        
        if (data) {
          const formatted = data.map((p: any) => ({
            ...p,
            rating: Number(p.rating) || 0,
            reviews: Number(p.reviews) || 0,
            price: Number(p.price) || 0,
            image_url: p.image_url
          }))
          setWishlistProducts(formatted)
        }
      } catch (error) {
        console.error("Error fetching wishlist products:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!wishlistLoading) {
      fetchWishlistProducts()
    }
  }, [wishlist, wishlistLoading])

  if (wishlistLoading || loading) {
    return (
      <div className="bg-white min-h-[60vh] py-24 flex items-center justify-center text-zinc-900">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pt-4 pb-20 text-zinc-900">
      <div className="container-xl">
        <ScrollAnimate type="fade-down" className="mb-10 pb-6 border-b border-zinc-200">
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-semibold block mb-1">
            ✦ Personal Archive
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal text-zinc-950 mb-1">
            Your Private Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 font-light">
            Curated high fine jewelry pieces reserved in your personal viewing ledger.
          </p>
        </ScrollAnimate>

        {wishlistProducts.length === 0 ? (
          <ScrollAnimate type="scale-up">
            <div className="bg-zinc-50 border border-zinc-200 p-14 text-center max-w-xl mx-auto space-y-4">
              <div className="w-14 h-14 bg-white border border-zinc-200 flex items-center justify-center mx-auto text-[#C5A059] shadow-xs">
                <Heart className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-serif text-zinc-950 font-normal mb-0">
                Your wishlist is currently empty
              </h2>
              <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-sm mx-auto">
                Explore our fine jewelry archives to bookmark creations for bespoke acquisition.
              </p>
              <Link 
                href="/products" 
                className="inline-block bg-black text-white hover:bg-zinc-800 px-8 py-3 text-xs font-semibold tracking-wider transition-colors shadow-xs"
              >
                Explore The Collections
              </Link>
            </div>
          </ScrollAnimate>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product, i) => (
              <ScrollAnimate key={product.id} type="fade-up" delay={i * 80}>
                <ProductCard product={product} />
              </ScrollAnimate>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
