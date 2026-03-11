'use client'

import { ProductCard } from '@/components/product-card'
import { getProducts, getCategories } from '@/lib/api'
import { Product, Category } from '@/lib/types'
import { ScrollAnimate } from '@/components/scroll-animate'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Gem, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const CATEGORY_IMAGES: Record<string, string> = {
  'Rings': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  'Necklaces': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
  'Earrings': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
  'Bracelets': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
  'Watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
}
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

      {/* ── Hero Section (Strict White & Gold Minimalism) ── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-full w-1/2 ml-auto opacity-100">
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

      {/* ── Trust Badges ── */}
      <section className="bg-card border-b border-border py-8">
        <div className="container-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $1,000' },
              { icon: ShieldCheck, title: 'Certified Gems', desc: 'Sourced responsibly & ethical' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '30-day money back guarantee' },
              { icon: Gem, title: 'Lifetime Warranty', desc: 'Protection for your investment' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center text-accent shrink-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest leading-tight mb-1">{item.title}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section id="featured" className="mt-10 section-padding bg-background">
        <div className="container-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <ScrollAnimate type="fade-up">
              <span className="text-accent font-bold tracking-widest text-xs uppercase mb-2 block">
                Exquisite Selection
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-0 uppercase text-accent">Featured Pieces</h2>
            </ScrollAnimate>
            <ScrollAnimate type="fade-up" delay={100}>
              <Link href="/products" className="btn-ghost flex items-center gap-2 group">
                View all products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollAnimate>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : featuredProducts.map((product, i) => (
              <ScrollAnimate key={product.id} type="scale-up" delay={([0, 100, 200, 300] as const)[i] ?? 0}>
                <ProductCard product={product} />
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Banners (Minimalist Gold Grid) ── */}
      <section className="py-40 bg-white border-y-2 border-accent/10">
        <div className="container-xl">
          <div className="flex items-end justify-between mb-24">
            <div className="max-w-xl">
              <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Selection</span>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-accent">The Collections</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-accent/10">
            {categories.slice(0, 4).map((cat, i) => (
              <ScrollAnimate key={cat.id} type="fade-up" delay={i * 100}>
                <Link href={`/products?category=${cat.name}`} className={`group relative h-[600px] block bg-white ${i < (categories.length - 1) ? 'lg:border-r-2 border-accent/10' : ''}`}>
                  <div className="absolute inset-x-0 top-0 h-2/3 overflow-hidden">
                    <Image 
                      src={CATEGORY_IMAGES[cat.name] || DEFAULT_CAT_IMAGE} 
                      alt={cat.name} 
                      fill 
                      className="object-cover grayscale-[0.5] contrast-[1.1] group-hover:grayscale-0 transition-all duration-1000" 
                    />
                    <div className="absolute inset-0 bg-accent/5" />
                  </div>
                  <div className="absolute inset-x-12 bottom-12">
                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-4 block">EXPLORE COLLECTION</span>
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 text-accent/90">{cat.name}</h3>
                    <div className="inline-block border-b-2 border-accent py-2 text-[9px] font-black uppercase tracking-[0.3em] group-hover:pr-6 transition-all text-accent">
                      VIEW ARCHIVE
                    </div>
                  </div>
                </Link>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="section-padding">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimate type="fade-right">
              <div className="relative h-[600px] border-l-8 border-accent/10 overflow-hidden bg-secondary">
                <Image
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"
                  alt="Crafting Jewelry"
                  fill
                  className="object-cover grayscale-[0.3]"
                />
              </div>
            </ScrollAnimate>
            <div>
              <ScrollAnimate type="fade-left">
                <span className="text-accent font-bold tracking-widest text-xs uppercase mb-4 block">Our Heritage</span>
                <h2 className="mb-8 leading-tight">Crafted with Unwavering <br /> Passion and Excellence</h2>
                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    Since our founding, Luxora has been dedicated to creating jewelry that
                    transcends time. Our master craftspeople combine traditional techniques
                    with modern design sensibilities.
                  </p>
                  <p>
                    Every piece is a testament to our commitment to quality, sustainability,
                    and ethical sourcing. We believe luxury should be meaningful.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-12">
                  <div>
                    <h4 className="text-foreground mb-2">Sustainable</h4>
                    <p className="text-sm">Ethically sourced materials and gems.</p>
                  </div>
                  <div>
                    <h4 className="text-foreground mb-2">Artisan</h4>
                    <p className="text-sm">Handcrafted by master jewelers.</p>
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
