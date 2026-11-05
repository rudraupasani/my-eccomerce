'use client'

import { getProducts, getProductById } from '@/lib/api'
import { ProductDetail } from '@/components/product-detail'
import { ProductCard } from '@/components/product-card'
import { ScrollAnimate } from '@/components/scroll-animate'
import Link from 'next/link'
import { ChevronRight, Loader2, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProductData() {
      const { id } = await params

      if (!id || id === 'undefined') {
        setLoading(false)
        return
      }

      // Basic UUID validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(id)) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const pData = await getProductById(id)
        setProduct(pData)

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
      <div className="bg-white min-h-[60vh] py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-white min-h-[60vh] py-20 text-center text-zinc-900 px-4">
        <h1 className="text-3xl font-serif font-light mb-3">Piece not found</h1>
        <p className="text-xs text-zinc-500 mb-6">The requested archive piece may have been acquired or relocated.</p>
        <Link href="/products" className="inline-block bg-black text-white px-6 py-2.5 text-xs font-semibold tracking-wider">
          Explore Archive
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pt-4 pb-20 text-zinc-900">
      <div className="container-xl">
        
        {/* Breadcrumbs (Clean upper spacing) */}
        <ScrollAnimate type="fade-down" className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <Link href="/products" className="hover:text-black transition">Collection</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[#C5A059] font-medium truncate max-w-xs">{product.name}</span>
        </ScrollAnimate>

        <ProductDetail product={product} reviews={[]} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-14 border-t border-zinc-200">
            <ScrollAnimate type="fade-up" className="mb-10 flex items-end justify-between">
              <div>
                <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] font-semibold block mb-1">
                  ✦ Coordinated Sets
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-zinc-950 mb-0">
                  Complementary Creations
                </h2>
              </div>
              <Link 
                href="/products" 
                className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-700 hover:text-black transition-colors"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </ScrollAnimate>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ScrollAnimate key={p.id} type="fade-up" delay={i * 80}>
                  <ProductCard product={p} />
                </ScrollAnimate>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
