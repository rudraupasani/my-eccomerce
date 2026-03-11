'use client'

import { ScrollAnimate } from '@/components/scroll-animate'
import { ProductCard } from '@/components/product-card'
import { useWishlist } from '@/app/context/wishlist-context'
import { Heart, Search, ShoppingBag, Loader2 } from 'lucide-react'
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
      <div className="bg-background min-h-screen pt-40 pb-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pt-40 pb-24">
      <div className="container-xl">
        <ScrollAnimate type="fade-down" className="mb-16">
          <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Personal Archive</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Your Wishlist</h1>
          <p className="text-foreground/40 font-medium italic">High jewelry pieces currently in your private interest list.</p>
        </ScrollAnimate>

        {wishlistProducts.length === 0 ? (
          <ScrollAnimate type="scale-up">
            <div className="bg-card border border-accent/10 p-20 rounded-3xl text-center shadow-sm">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-10">
                <Heart className="w-10 h-10 text-accent/20" />
              </div>
              <h2 className="text-3xl font-bold mb-6 italic tracking-tight uppercase">Your interest list is empty</h2>
              <p className="text-muted-foreground mb-12 max-w-sm mx-auto uppercase text-xs font-bold tracking-widest leading-loose">
                Explore our full archive to find pieces that resonate with your legacy.
              </p>
              <Link href="/products" className="btn-primary px-12 py-5">
                Browse Collection
              </Link>
            </div>
          </ScrollAnimate>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistProducts.map((product, i) => (
              <ScrollAnimate key={product.id} type="fade-up" delay={i * 100}>
                <ProductCard product={product} />
              </ScrollAnimate>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
