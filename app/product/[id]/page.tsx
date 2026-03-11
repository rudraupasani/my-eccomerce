'use client'

import { getProducts, getProductById } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { ProductDetail } from '@/components/product-detail'
import { ProductCard } from '@/components/product-card'
import { ScrollAnimate } from '@/components/scroll-animate'
import Link from 'next/link'
import { ChevronRight, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProductData() {
      const { id } = await params

      if (!id || id === 'undefined') {
        console.error("Invalid product ID path:", id)
        setLoading(false)
        return
      }

      // Basic UUID validation (8-4-4-4-12 hex chars)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(id)) {
        console.error("Malformed product ID (not a valid UUID):", id)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // 1. Fetch main product
        const pData = await getProductById(id)
        setProduct(pData)

        // 2. Fetch related products (same category)
        if (pData) {
          const related = await getProducts({ categoryId: pData.category_id })
          const formattedRelated = related
            .filter((p: any) => p.id !== id)
            .map((p: any) => ({
              ...p,
              rating: Number(p.rating) || 0,
              reviews: Number(p.reviews) || 0,
              category: p.categories?.name || 'Uncategorized'
            }))
          setRelatedProducts(formattedRelated.slice(0, 4))
        }

      } catch (error: any) {
        console.error("Error loading product:", error?.message || error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [params])

  if (loading) {
    return (
      <div className="bg-background min-h-screen pt-40 pb-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-background min-h-screen pt-40 pb-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/products" className="text-accent hover:underline mt-4 block">Back to Collection</Link>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="container-xl">
        {/* Breadcrumbs */}
        <ScrollAnimate type="fade-down" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-12">
          <Link href="/" className="hover:text-accent transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-accent transition">Collection</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-accent">{product.name}</span>
        </ScrollAnimate>

        <ProductDetail product={product} reviews={[]} />

        {/* Related Products */}
        <div className="mt-32">
          <ScrollAnimate type="fade-up" className="mb-12 flex items-end justify-between">
            <div>
              <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Curation</span>
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter italic">Complementary Pieces</h2>
            </div>
            <Link href="/products" className="hidden sm:block text-[10px] font-black uppercase tracking-widest border-b-2 border-accent pb-1 hover:text-accent transition">
              View Archive
            </Link>
          </ScrollAnimate>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p, i) => (
              <ScrollAnimate key={p.id} type="fade-up" delay={i * 100}>
                <ProductCard product={p} />
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
