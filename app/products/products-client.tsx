'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { ChevronDown, SlidersHorizontal, Search as SearchIcon, X } from 'lucide-react'
import { ScrollAnimate } from '@/components/scroll-animate'
import { getProducts, getCategories } from '@/lib/api'
import { Product } from '@/lib/types'

interface Props {
  categoryFilter: string
}

export default function ProductsClient({ categoryFilter }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter?.trim() || 'All')
  const [searchQuery, setSearchQuery] = useState('')

  const [sortBy, setSortBy] = useState('featured')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [priceRanges, setPriceRanges] = useState<string[]>([])

  const priceOptions = [
    { label: 'Under ₹20,000', min: 0, max: 20000 },
    { label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
    { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
    { label: 'Over ₹1,00,000', min: 100000, max: Infinity },
  ]

  // Sync category filter & search query from URL params
  useEffect(() => {
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    if (category) {
      setSelectedCategory(decodeURIComponent(category).trim())
    } else {
      setSelectedCategory('All')
    }
    if (search) {
      setSearchQuery(decodeURIComponent(search).trim())
    }
  }, [searchParams])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts(),
          getCategories()
        ])

        const formattedProducts: Product[] = fetchedProducts.map(p => {
          const categoryName = p.categories?.name || p.category || 'Uncategorized'
          return {
            ...p,
            image_url: p.image_url,
            category: categoryName,
            in_stock: p.in_stock,
            rating: Number(p.rating) || 0,
            reviews: Number(p.reviews) || 0
          }
        })

        setProducts(formattedProducts)
        const categoryList = ['All', ...fetchedCategories.map(c => c.name)]
        setCategories(categoryList)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const togglePriceRange = (label: string) => {
    setPriceRanges(prev =>
      prev.includes(label)
        ? prev.filter(r => r !== label)
        : [...prev, label]
    )
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    if (category === 'All') {
      router.push('/products')
    } else {
      router.push(`/products?category=${encodeURIComponent(category)}`)
    }
  }

  const filteredProducts = products.filter(p => {
    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch = p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      if (!matchesSearch) return false
    }

    // Category filter
    const productCategory = (p.category || '').trim()
    const filterCategory = (selectedCategory || '').trim()

    if (filterCategory && filterCategory !== 'All' && productCategory !== filterCategory) {
      return false
    }

    // Price range filter
    if (priceRanges.length > 0) {
      const inPriceRange = priceRanges.some(selectedRange => {
        const option = priceOptions.find(o => o.label === selectedRange)
        if (!option) return false
        return p.price >= option.min && p.price < option.max
      })
      if (!inPriceRange) return false
    }

    return true
  })

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
    <div className="bg-white min-h-screen text-zinc-900 pb-20">

      {/* ── Page Header (Clean White & Gold Header, No excessive upper space) ── */}
      <section className="border-b border-zinc-200 pt-6 pb-8 bg-zinc-50/60">
        <div className="container-xl">
          <div className="max-w-3xl space-y-3">
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-semibold block">
              ✦ Luméa Archives
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-normal text-zinc-950 mb-1">
              Fine Jewelry Collection
            </h1>
            <p className="text-zinc-600 font-light text-xs sm:text-sm leading-relaxed">
              Explore meticulously handcrafted jewels forged in solid gold, platinum, and ethical natural stones.
            </p>

            {/* Search Input Bar */}
            <div className="relative w-full max-w-xl pt-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection by name or gem..."
                className="w-full px-4 py-3 bg-white border border-zinc-300 text-zinc-900 text-xs sm:text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#C5A059] shadow-2xs transition-colors"
              />
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none mt-0.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Catalog Layout ── */}
      <div className="container-xl py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Filters Sidebar */}
          <aside className="lg:w-72 shrink-0">
            
            {/* Mobile Filter Trigger */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilterModal(!showFilterModal)}
                className="flex items-center gap-2 px-5 py-3 bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider w-full justify-center shadow-xs"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters & Categories</span>
              </button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:block space-y-8 sticky top-28">
              
              {/* Category Filter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A059]">
                    Categories
                  </h3>
                  {selectedCategory !== 'All' && (
                    <button 
                      onClick={() => handleCategorySelect('All')} 
                      className="text-[10px] text-zinc-500 hover:text-black uppercase tracking-wider cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  {loading ? (
                    <div className="space-y-2 animate-pulse">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-8 bg-zinc-100 border border-zinc-200" />
                      ))}
                    </div>
                  ) : (
                    categories.map(category => {
                      const isSelected = selectedCategory === category
                      return (
                        <button
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                          className={`px-4 py-2.5 text-xs text-left transition-all border ${
                            isSelected
                              ? 'bg-black text-white border-black font-medium shadow-xs'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:border-[#C5A059] hover:text-black'
                          }`}
                        >
                          {category}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A059]">
                    Price Range
                  </h3>
                  {priceRanges.length > 0 && (
                    <button 
                      onClick={() => setPriceRanges([])} 
                      className="text-[10px] text-zinc-500 hover:text-black uppercase tracking-wider cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {priceOptions.map(option => (
                    <label 
                      key={option.label} 
                      className="flex items-center gap-3 p-2 border border-zinc-200 bg-white hover:border-[#C5A059] transition-colors cursor-pointer text-xs text-zinc-700"
                    >
                      <input
                        type="checkbox"
                        checked={priceRanges.includes(option.label)}
                        onChange={() => togglePriceRange(option.label)}
                        className="w-3.5 h-3.5 accent-black"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Products Grid Column */}
          <div className="flex-1">
            
            {/* Sort & Quantity Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-200">
              <div className="text-xs font-light text-zinc-600">
                Displaying <span className="text-zinc-950 font-medium">{sortedProducts.length}</span> pieces
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs uppercase tracking-widest text-zinc-600 hidden sm:inline">Sort:</span>
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-48 px-4 py-2 bg-white border border-zinc-300 text-xs text-zinc-900 appearance-none cursor-pointer focus:outline-none focus:border-[#C5A059] shadow-2xs"
                  >
                    <option value="featured">Featured Archive</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters Badges */}
            {(selectedCategory !== 'All' || priceRanges.length > 0 || searchQuery.trim()) && (
              <div className="mb-6 flex flex-wrap gap-2 items-center">
                <span className="text-[11px] uppercase tracking-widest text-zinc-500">Filtered By:</span>
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-zinc-300 text-xs text-zinc-800">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="text-zinc-500 hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-zinc-300 text-xs text-zinc-800">
                    Category: {selectedCategory}
                    <button onClick={() => handleCategorySelect('All')} className="text-zinc-500 hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {priceRanges.map(range => (
                  <span key={range} className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-zinc-300 text-xs text-zinc-800">
                    {range}
                    <button onClick={() => setPriceRanges(prev => prev.filter(r => r !== range))} className="text-zinc-500 hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-[4/5] bg-zinc-100 border border-zinc-200 animate-pulse" />
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product, i) => (
                  <ScrollAnimate key={product.id} type="scale-up" delay={([0, 80, 160] as const)[i % 3] as any}>
                    <ProductCard product={product} />
                  </ScrollAnimate>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-50 border border-zinc-200 space-y-4">
                <p className="text-zinc-950 font-serif text-xl">
                  No jewelry pieces match your active filters.
                </p>
                <p className="text-xs text-zinc-500">
                  Try adjusting your search criteria or resetting filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All')
                    setPriceRanges([])
                    setSearchQuery('')
                    router.push('/products')
                  }}
                  className="mt-3 px-6 py-2.5 bg-black text-white text-xs font-semibold tracking-wider hover:bg-zinc-800"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md p-6 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
            <h3 className="font-serif text-xl text-zinc-950">Filter Collections</h3>
            <button onClick={() => setShowFilterModal(false)} className="p-2 text-zinc-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#C5A059] mb-3 font-semibold">Categories</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      handleCategorySelect(cat)
                      setShowFilterModal(false)
                    }}
                    className={`p-3 text-xs text-left border ${
                      selectedCategory === cat ? 'bg-black text-white border-black' : 'border-zinc-200 text-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#C5A059] mb-3 font-semibold">Price Range</h4>
              <div className="space-y-2">
                {priceOptions.map(option => (
                  <label key={option.label} className="flex items-center gap-3 p-3 border border-zinc-200 text-xs">
                    <input
                      type="checkbox"
                      checked={priceRanges.includes(option.label)}
                      onChange={() => togglePriceRange(option.label)}
                      className="accent-black"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full py-3.5 bg-black text-white font-semibold text-xs tracking-wider uppercase"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
