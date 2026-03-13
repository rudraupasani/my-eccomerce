'use client'

import { ProductCard } from '@/components/product-card'
import { getProducts, getCategories } from '@/lib/api'
import { Product, Category } from '@/lib/types'
import { ScrollAnimate } from '@/components/scroll-animate'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Gem, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const DEFAULT_CAT_IMAGE = 'https://images.unsplash.com/photo-1515562141207-7a88bb7ce338?w=800&q=80'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [rawProducts, rawCategories] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        
        const formattedProducts = rawProducts.slice(0, 4).map(p => ({
          ...p,
          image_url: p.image_url,
          category: p.categories?.name || 'Uncategorized',
          in_stock: p.in_stock,
          rating: Number(p.rating) || 0,
          reviews: Number(p.reviews) || 0
        }))
        
        setFeaturedProducts(formattedProducts)
        setCategories(rawCategories)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col space-y-0">

      {/* ── Hero Section (Premium Modern Design) ── */}
     <section className="relative min-h-[80vh]  flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 md:inset-x-0 top-0 h-full md:w-1/2 ml-auto opacity-100">
          <Image
            src="/hero-luxury-jewelry.jpg"
            alt="Luxury jewelry"
            fill
            className="object-cover grayscale-[0.2] contrast-[1.1]"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-white via-white/40 to-transparent" />
        </div>

        <div className="container-xl relative z-10 w-full py-20">
          <div className="max-w-4xl">
            <ScrollAnimate type="fade-left">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-accent text-[10px] font-black tracking-[0.4em] uppercase">
                  Est. 2024
                </span>
              </div>

              <h1 className="text-accent mb-8 leading-[0.9] text-4xl md:text-6xl lg:text-7xl">
                PURE <br />
                <span className="text-accent font-light tracking-tighter">BRILLIANCE</span>
              </h1>

              <p className="text-accent/60 text-base md:text-lg mb-12 leading-relaxed max-w-sm font-medium tracking-wide pl-4 border-l-2 border-accent/20">
                A design language spoken in white and gold. <br />
                Crafted for those who define elegance.
              </p>

              <div className="flex flex-wrap gap-12 items-center ">
                <Link href="/products" className="btn-primary rounded-2xl">
                  View Archive
                </Link>
              </div>
            </ScrollAnimate>
          </div>
        </div>

        {/* Vertical Border Decoration (Shadowless) */}
        <div className="absolute right-0 top-0 h-full w-px bg-accent/20" />

      </section>

      {/* ── Trust Badges (Modern Cards) ── */}
      <section className="bg-gradient-to-b from-background to-secondary/30 py-16 md:py-24 border-b border-border">
        <div className="container-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹83,000' },
              { icon: ShieldCheck, title: 'Certified Gems', desc: 'Ethically sourced' },
              { icon: RotateCcw, title: '30-Day Returns', desc: 'Risk-free guarantee' },
              { icon: Gem, title: 'Lifetime Warranty', desc: 'Protect your investment' },
            ].map((item, i) => (
              <div key={i} className="group p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 hover:shadow-lg">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:bg-accent/20 transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <h4 className="text-sm md:text-base font-bold uppercase tracking-wider mb-2">{item.title}</h4>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products (Modern Grid) ── */}
      <section id="featured" className="section-padding mt-10 bg-background">
        <div className="container-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 md:mb-16 gap-6">
            <ScrollAnimate type="fade-up">
              <div>
                <span className="text-accent font-bold tracking-widest text-xs uppercase mb-3 block opacity-75">
                  ✨ Exquisite Selection
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter uppercase text-foreground">Featured Pieces</h2>
              </div>
            </ScrollAnimate>
            <ScrollAnimate type="fade-up" delay={100}>
              <Link href="/products" className="btn-ghost flex items-center gap-2 group whitespace-nowrap">
                View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollAnimate>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, i) => (
                <ScrollAnimate key={product.id} type="scale-up" delay={(i * 100) as any}>
                  <ProductCard product={product} />
                </ScrollAnimate>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                No products available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Category Collections (Modern Grid) ── */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-secondary/20">
        <div className="container-xl">
          <div className="mb-12 md:mb-20">
            <ScrollAnimate type="fade-up">
              <span className="text-accent text-xs font-bold uppercase tracking-widest mb-4 block opacity-75">
                ✨ Collections
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter uppercase text-foreground">Explore by Category</h2>
            </ScrollAnimate>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 4).map((cat, i) => (
              <ScrollAnimate key={cat.id} type="fade-up" delay={i * 100} className="group">
                <Link href={`/products?category=${encodeURIComponent(cat.name)}`} className="relative h-72 md:h-80 block rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl">
                  <div className="absolute inset-0">
                    <Image 
                      src={cat.image_url || DEFAULT_CAT_IMAGE} 
                      alt={cat.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white mb-2 group-hover:text-accent transition-colors">{cat.name}</h3>
                    <p className="text-xs md:text-sm text-white/80 font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Discover Collection</p>
                  </div>
                </Link>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>


      {/* ── About Section (Modern) ── */}
      <section id="about" className="section-padding bg-background">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <ScrollAnimate type="fade-right">
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden border border-border shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"
                  alt="Crafting Jewelry"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent" />
              </div>
            </ScrollAnimate>
            <div className="space-y-8">
              <ScrollAnimate type="fade-left">
                <div>
                  <span className="text-accent font-bold tracking-widest text-xs uppercase mb-4 block opacity-75">📖 Our Heritage</span>
                  <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold tracking-tighter text-foreground mb-6">Crafted with Passion & Excellence</h2>
                </div>
              </ScrollAnimate>
              <ScrollAnimate type="fade-left" delay={100}>
                <div className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed">
                  <p>
                    Since our founding, we've been dedicated to creating jewelry that
                    transcends time. Our master craftspeople combine traditional techniques
                    with modern design sensibilities to create pieces that speak.
                  </p>
                  <p>
                    Every piece is a testament to our commitment to quality, sustainability,
                    and ethical sourcing. We believe true luxury should be meaningful and responsible.
                  </p>
                </div>
              </ScrollAnimate>
              <ScrollAnimate type="fade-left" delay={200}>
                <div className="grid grid-cols-2 gap-6 md:gap-8 pt-6 border-t border-border">
                  <div className="space-y-2">
                    <h4 className="text-foreground font-bold text-lg">Sustainable</h4>
                    <p className="text-sm text-muted-foreground">Ethically sourced materials and conflict-free gems.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-foreground font-bold text-lg">Artisan Crafted</h4>
                    <p className="text-sm text-muted-foreground">Handcrafted by master jewelers with decades of experience.</p>
                  </div>
                </div>
              </ScrollAnimate>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter (Strict White & Gold) ── */}
      <section className="bg-white py-40 border-t-2 border-accent/10">
        <div className="container-xl">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollAnimate type="scale-up">
              <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Communications</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8">Private Access</h2>
              <p className="text-accent/40 mb-12 text-lg italic font-medium leading-relaxed">
                "Be the first to witness the unveiling of our latest archives."
              </p>
              <form className="flex flex-col md:flex-row gap-0 border-2 border-accent/20 p-2 rounded-full overflow-hidden bg-white/50 backdrop-blur-sm" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email for private viewing invitation"
                  className="flex-1 px-8 py-6 bg-transparent border-0 text-accent placeholder:text-accent/30 focus:outline-none font-bold tracking-widest text-xs uppercase"
                />
                <button type="submit" className="btn-primary px-16 py-6 font-black tracking-[0.4em] bg-accent text-white rounded-full hover:bg-accent/90 transition-all active:scale-95">
                  JOIN LIST
                </button>
              </form>
            </ScrollAnimate>
          </div>
        </div>
      </section>

    </div>
  )
}
