'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { ChevronDown, SlidersHorizontal, LayoutGrid, List, Search as SearchIcon } from 'lucide-react'
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
  const [showFilters, setShowFilters] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [priceRanges, setPriceRanges] = useState<string[]>([])

  const priceOptions = [
    { label: 'Under $2,000', min: 0, max: 2000 },
    { label: '$2,000 - $4,000', min: 2000, max: 4000 },
    { label: '$4,000 - $6,000', min: 4000, max: 6000 },
    { label: 'Over $6,000', min: 6000, max: Infinity },
  ]

  // Sync category filter from URL params
  useEffect(() => {
    const category = searchParams.get('category')
    const trimmedCategory = category ? decodeURIComponent(category).trim() : 'All'
    setSelectedCategory(trimmedCategory)
  }, [searchParams])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        
        console.log('Fetched Products:', fetchedProducts)
        console.log('Fetched Categories:', fetchedCategories)
        
        // Map backend schema to frontend Product interface
        const formattedProducts: Product[] = fetchedProducts.map(p => {
          const categoryName = p.categories?.name || 'Uncategorized'
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
        console.log('Categories List:', categoryList)
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

    // Category filter - compare with selectedCategory (trim and compare)
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
    <div className="bg-background min-h-screen pb-20">

      {/* ── Page Header (Modern) ── */}
      <section className="bg-gradient-to-br from-secondary/20 via-background to-background pt-12 md:pt-20 pb-12 md:pb-16 border-b border-border">
        <div className="container-xl">
          <ScrollAnimate type="fade-down">
            <div className="flex flex-col gap-4 md:gap-6">
              <span className="inline-block text-accent text-xs font-bold uppercase tracking-widest px-3 py-1.5 bg-accent/10 rounded-full w-fit">✨ Collection</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-foreground">Our Jewelry <span className="text-accent">Collection</span></h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
                Curated selection of exquisite pieces. Viewing <span className="text-accent font-semibold">{selectedCategory}</span>
              </p>

              {/* Search Bar */}
              <div className="relative w-full max-w-xl mt-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full px-6 py-4 bg-white border-2 border-accent/20 rounded-2xl text-sm font-medium focus:border-accent focus:outline-none transition-all placeholder:text-muted-foreground"
                />
                <SearchIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="container-xl py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Filters Sidebar (Modern) */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-32 space-y-8">
              
              <div className="flex items-center justify-between lg:hidden mb-6">
                <button
                  onClick={() => setShowFilterModal(!showFilterModal)}
                  className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider px-4 py-3 bg-accent text-white rounded-lg hover:shadow-lg transition-all active:scale-95"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
              </div>

              <div className={`hidden lg:block space-y-10`}>
                {/* Category Filter (Modern) */}
                <ScrollAnimate type="fade-right">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Categories</h3>
                      {selectedCategory !== 'All' && (
                        <button onClick={() => handleCategorySelect('All')} className="text-[10px] font-bold text-accent hover:text-accent/70 uppercase tracking-wider">Reset</button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {loading ? (
                         <div className="animate-pulse space-y-3">
                            {[1,2,3,4].map(i => <div key={i} className="h-4 bg-secondary rounded w-2/3" />)}
                         </div>
                      ) : (
                        categories.map(category => (
                          <button
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                            className={`px-4 py-3 text-sm rounded-lg font-medium transition-all text-left ${
                              selectedCategory === category
                                ? 'bg-accent text-white shadow-lg'
                                : 'text-foreground bg-card border border-border hover:border-accent/50 hover:shadow-md hover:bg-secondary/50'
                            }`}
                          >
                            {category}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </ScrollAnimate>

                {/* Price Filter (Modern) */}
                <ScrollAnimate type="fade-right" delay={100}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price Range</h3>
                      {priceRanges.length > 0 && (
                        <button onClick={() => setPriceRanges([])} className="text-[10px] font-bold text-accent hover:text-accent/70 uppercase tracking-wider">Reset</button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {priceOptions.map(option => (
                        <label key={option.label} className="flex items-center gap-3 group cursor-pointer p-2 rounded hover:bg-secondary/50 transition-colors">
                          <input
                            type="checkbox"
                            checked={priceRanges.includes(option.label)}
                            onChange={() => togglePriceRange(option.label)}
                            className="w-4 h-4 border border-border rounded accent-accent cursor-pointer"
                          />
                          <span className="text-sm text-foreground/80 group-hover:text-accent transition-colors">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </ScrollAnimate>
              </div>
            </div>
          </aside>

          {/* Products Grid Area */}
          <div className="flex-1">
            {/* Sort & View Controls (Modern) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-border">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1 p-1.5 bg-secondary/50 rounded-lg border border-border">
                  <button className="p-2 bg-white shadow-sm rounded-md text-accent font-bold text-xs uppercase tracking-wider" title="Grid view">
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/50 rounded-md transition-all text-xs uppercase" title="List view">
                    <List className="w-4 h-4" />
                  </button>
                </div>
                {!loading && (
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider bg-secondary/50 px-3 py-2 rounded-lg border border-border">
                    {sortedProducts.length} of {products.length} Items
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground hidden sm:inline">Sort</span>
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none w-full px-4 py-2.5 pr-10 border border-border rounded-lg bg-card text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent transition hover:border-accent/50"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory !== 'All' || priceRanges.length > 0 || searchQuery.trim()) && (
              <div className="mb-8 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Filters:</span>
                {searchQuery.trim() && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-full">
                    <span className="text-xs font-semibold text-accent">Search: "{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-accent hover:text-accent/70 font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
                {selectedCategory !== 'All' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-full">
                    <span className="text-xs font-semibold text-accent">{selectedCategory}</span>
                    <button
                      onClick={() => handleCategorySelect('All')}
                      className="text-accent hover:text-accent/70 font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
                {priceRanges.map(range => (
                  <div key={range} className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-full">
                    <span className="text-xs font-semibold text-accent">{range}</span>
                    <button
                      onClick={() => setPriceRanges(prev => prev.filter(r => r !== range))}
                      className="text-accent hover:text-accent/70 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid (Modern) */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="animate-pulse bg-gradient-to-br from-secondary/50 to-secondary aspect-[3/4] rounded-2xl border border-border" />
                 ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {sortedProducts.map((product, i) => (
                  <ScrollAnimate key={product.id} type="scale-up" delay={([0, 100, 200] as const)[i % 3] as any}>
                    <ProductCard product={product} />
                  </ScrollAnimate>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-gradient-to-b from-secondary/30 to-secondary/10 rounded-2xl border-2 border-dashed border-border/50 space-y-6">
                <div>
                  <p className="text-muted-foreground text-lg mb-2 font-medium">
                    No products match your filters.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your category or price range selection.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a 
                    href="/products"
                    className="btn-primary"
                  >
                    View All Products
                  </a>
                  <button
                    onClick={() => setPriceRanges([])}
                    className="btn-secondary"
                  >
                    Clear Price Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Popup Modal ── */}
      {showFilterModal && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFilterModal(false)}
          />
          <div className="absolute bottom-0 w-full bg-white rounded-t-3xl border-t-4 border-accent p-6 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider">Filters</h2>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="text-muted-foreground hover:text-foreground transition text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-8">
              {/* Category Filter Modal */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Categories</h3>
                  {selectedCategory !== 'All' && (
                    <button onClick={() => handleCategorySelect('All')} className="text-[10px] font-bold text-accent hover:text-accent/70 uppercase tracking-wider">Reset</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {loading ? (
                    <div className="col-span-2 animate-pulse space-y-2">
                      {[1,2,3,4].map(i => <div key={i} className="h-10 bg-secondary rounded" />)}
                    </div>
                  ) : (
                    categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          handleCategorySelect(category)
                          setShowFilterModal(false)
                        }}
                        className={`px-3 py-2 text-xs rounded-lg font-medium transition-all text-center ${
                          selectedCategory === category
                            ? 'bg-accent text-white shadow-lg'
                            : 'text-foreground bg-card border border-border'
                        }`}
                      >
                        {category}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Price Filter Modal */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Price Range</h3>
                  {priceRanges.length > 0 && (
                    <button onClick={() => setPriceRanges([])} className="text-[10px] font-bold text-accent hover:text-accent/70 uppercase tracking-wider">Reset</button>
                  )}
                </div>
                <div className="space-y-2">
                  {priceOptions.map(option => (
                    <label key={option.label} className="flex items-center gap-3 group cursor-pointer p-3 rounded-lg bg-card border border-border hover:border-accent/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={priceRanges.includes(option.label)}
                        onChange={() => togglePriceRange(option.label)}
                        className="w-5 h-5 rounded accent-accent cursor-pointer"
                      />
                      <span className="text-sm text-foreground font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full mt-8 btn-primary py-3 font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
