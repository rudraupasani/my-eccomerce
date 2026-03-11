'use client'

import React, { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product-card'
import { ChevronDown, SlidersHorizontal, LayoutGrid, List } from 'lucide-react'
import { ScrollAnimate } from '@/components/scroll-animate'
import { getProducts, getCategories } from '@/lib/api'
import { Product } from '@/lib/types'

interface Props {
  categoryFilter: string
}

export default function ProductsClient({ categoryFilter }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        
        // Map backend schema to frontend Product interface
        const formattedProducts: Product[] = fetchedProducts.map(p => ({
          ...p,
          image_url: p.image_url,
          category: p.categories?.name || 'Uncategorized',
          in_stock: p.in_stock,
          rating: Number(p.rating) || 0,
          reviews: Number(p.reviews) || 0
        }))

        setProducts(formattedProducts)
        setCategories(['All', ...fetchedCategories.map(c => c.name)])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const filteredProducts = categoryFilter === 'All'
    ? products
    : products.filter(p => p.category === categoryFilter)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <div className="bg-background min-h-screen pb-20">

      {/* ── Page Header ── */}
      <section className="bg-secondary/30 pt-16 pb-12 border-b border-border">
        <div className="container-xl">
          <ScrollAnimate type="fade-down">
            <h1 className="text-3xl md:text-4xl mb-3">Our Jewelry Collection</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Viewing Category 
              <span className="w-1 h-1 bg-muted-foreground rounded-full" />
              <span className="text-accent font-semibold">{categoryFilter}</span>
            </p>
          </ScrollAnimate>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="container-xl py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-8">
              
              <div className="flex items-center justify-between lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-10`}>
                {/* Category Filter */}
                <ScrollAnimate type="fade-right">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Explore Categories</h3>
                  <div className="flex flex-col gap-1">
                    {loading ? (
                       <div className="animate-pulse space-y-3">
                          {[1,2,3,4].map(i => <div key={i} className="h-4 bg-secondary rounded w-2/3" />)}
                       </div>
                    ) : (
                      categories.map(category => (
                        <a
                          key={category}
                          href={`/products${category !== 'All' ? `?category=${category}` : ''}`}
                          className={`px-3 py-2 text-sm rounded transition-colors group flex items-center justify-between ${
                            categoryFilter === category
                              ? 'bg-accent text-white font-bold'
                              : 'text-foreground hover:bg-secondary'
                          }`}
                        >
                          {category}
                          {categoryFilter !== category && (
                            <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </a>
                      ))
                    )}
                  </div>
                </ScrollAnimate>

                {/* Price Filter */}
                <ScrollAnimate type="fade-right" delay={100}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Price Range</h3>
                  <div className="space-y-3">
                    {['Under $2,000', '$2,000 - $4,000', '$4,000 - $6,000', 'Over $6,000'].map(range => (
                      <label key={range} className="flex items-center gap-2 group cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 border-border rounded accent-accent" />
                        <span className="text-sm text-foreground/80 group-hover:text-accent transition-colors">{range}</span>
                      </label>
                    ))}
                  </div>
                </ScrollAnimate>
              </div>
            </div>
          </aside>

          {/* Products Grid Area */}
          <div className="flex-1">
            {/* Sort & View Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 p-1 bg-secondary rounded border border-border">
                  <button className="p-1.5 bg-background shadow-sm rounded text-accent">
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-muted-foreground hover:text-foreground">
                    <List className="w-4 h-4" />
                  </button>
                </div>
                {!loading && (
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {sortedProducts.length} Items Total
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sort By</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-border rounded bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent transition"
                  >
                    <option value="featured">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="animate-pulse bg-secondary/50 aspect-[3/4] rounded-2xl border border-border" />
                 ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map((product, i) => (
                  <ScrollAnimate key={product.id} type="scale-up" delay={([0, 100, 200] as const)[i % 3] ?? 0}>
                    <ProductCard product={product} />
                  </ScrollAnimate>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-secondary/20 rounded-xl border-2 border-dashed border-border">
                <p className="text-muted-foreground text-lg mb-6">
                  No products found match your criteria.
                </p>
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="btn-primary"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
