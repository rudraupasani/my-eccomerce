'use client'

import { ProductCard } from '@/components/product-card'
import { getProducts, getCategories } from '@/lib/api'
import { Product, Category } from '@/lib/types'
import { ScrollAnimate } from '@/components/scroll-animate'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Gem,
  Loader2,
  ArrowUpRight
} from 'lucide-react'
import { useEffect, useState } from 'react'

const categoryMetadata: Record<string, { desc: string; fallbackImage: string }> = {
  rings: {
    desc: 'Solitaires, Pavé & Eternities',
    fallbackImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'
  },
  necklaces: {
    desc: 'Pendants, Collars & Chains',
    fallbackImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
  },
  earrings: {
    desc: 'Drops, Huggies & Chandelier',
    fallbackImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
  },
  bracelets: {
    desc: 'Bangles, Cuffs & Tennis Links',
    fallbackImage: 'https://images.unsplash.com/photo-1611591475817-21a473eecbdf?w=800&q=80'
  },
  watches: {
    desc: 'Chronographs & Haute Horlogerie',
    fallbackImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
  }
}

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

        const formattedProducts = rawProducts.map(p => ({
          ...p,
          image_url: p.image_url,
          category: p.categories?.name || p.category || 'Uncategorized',
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

  // Order categories prioritizing the reference image items (Rings, Necklaces, Earrings, Bracelets, Watches)
  const imageOrder = ['rings', 'necklaces', 'earrings', 'bracelets', 'watches']
  const sortedCategories = [...categories].sort((a, b) => {
    const idxA = imageOrder.indexOf(a.name.toLowerCase())
    const idxB = imageOrder.indexOf(b.name.toLowerCase())
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.name.localeCompare(b.name)
  })

  // Hero product for bottom right floating card: find necklace or first product from Supabase
  const heroProduct = featuredProducts.find(p =>
    p.category?.toLowerCase().includes('necklace') ||
    p.name?.toLowerCase().includes('necklace')
  ) || featuredProducts[0] || {
    id: '1',
    name: 'Golden Heritage Pendant Necklace',
    description: 'Designed To Elevate Every Moment With Effortless Sophistication.',
    price: 199.00,
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80'
  }

  return (
    <div className="flex flex-col space-y-0 overflow-x-hidden bg-white text-zinc-900">

      {/* ── 1. Hero Section (ONLY HERO IS BLACK - Image 2 Pixel-Accurate) ── */}
      <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black text-white pt-20 pb-8 sm:pb-12 px-6 sm:px-12 md:px-16">

        {/* Hero Background Image (Full Image Contained & Fully Visible on Right/Center) */}
        <div className="absolute inset-0 z-0 flex items-center justify-end pointer-events-none">
          <div className="relative w-full sm:w-[85%] md:w-[70%] lg:w-[62%] h-full ml-auto">
            <Image
              src="/hero-lumea.jpg"
              alt="Luméa High Jewelry - Blue Gemstone Pendant Necklace"
              fill
              priority
              className="object-contain md:object-cover lg:object-contain object-right brightness-[0.98] contrast-[1.05]"
            />
          </div>
          {/* Subtle vignette so left headline and bottom content remain high contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* Top/Middle Layer: Main Headline (Left) & Brand Statement (Right) */}
        <div className="relative z-10 w-full max-w-[1520px] mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-10 sm:pt-16">

          {/* Left Headline Area */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-7">
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal leading-[1.08] tracking-tight text-white mb-0">
              Jewelry That Speaks <br />
              <span className="italic font-light">In Quiet Luxury</span>
            </h1>

            <div>
              <Link
                href="/products"
                className="inline-flex items-center justify-center bg-white text-black hover:bg-zinc-200 px-5 mt-3 py-3.5 text-xs font-semibold tracking-wider transition-all duration-200 shadow-xl rounded-md"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          {/* Right Upper Description Paragraph (From Reference Image) */}
          <div className="lg:col-span-5 xl:col-span-6 flex justify-start lg:justify-end">
            <div className="max-w-xs sm:max-w-sm text-left lg:text-right space-y-2 lg:mr-6 xl:mr-12">
              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                The Timeless Pieces Created By Luméa Are Crafted With Precious Metals And Natural Gemstones.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Layer: Bottom-Left Category Brackets & Bottom-Right Floating Product Card */}
        <div className="relative z-10 w-full max-w-[1520px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pt-6">

          {/* Bottom Left Category Brackets (From Reference Image & Supabase) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono text-zinc-400">
            {(sortedCategories.length > 0
              ? sortedCategories
              : [
                { id: '1', name: 'Rings', slug: 'rings' },
                { id: '2', name: 'Necklaces', slug: 'necklaces' },
                { id: '3', name: 'Earrings', slug: 'earrings' },
                { id: '4', name: 'Bracelets', slug: 'bracelets' },
              ]
            ).map((cat) => (
              <Link
                key={cat.id || cat.name}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="hover:text-white transition-colors hover:scale-105 transform inline-block py-1"
              >
                [ {cat.name} ]
              </Link>
            ))}
          </div>

          {/* Bottom Right Floating Featured Card (Exact Image 2 Style, Loaded from Supabase) */}
          <div className="w-full sm:w-auto self-end">
            <Link
              href={`/product/${heroProduct.id}`}
              className="group block bg-white text-zinc-900 p-3 sm:p-4 shadow-2xl transition-all duration-300 hover:shadow-zinc-800/20 border border-zinc-200 max-w-sm w-full"
            >
              <div className="flex items-center gap-4">
                {/* Product Thumbnail from Supabase */}
                <div className="relative w-20 h-24 bg-zinc-100 overflow-hidden shrink-0">
                  <Image
                    src={heroProduct.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80'}
                    alt={heroProduct.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-serif text-sm sm:text-base font-medium text-zinc-950 truncate leading-snug">
                    {heroProduct.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 leading-tight mt-1 font-light">
                    {heroProduct.description || 'Designed To Elevate Every Moment With Effortless Sophistication.'}
                  </p>
                  <p className="text-sm font-semibold text-zinc-950 mt-2">
                    ${typeof heroProduct.price === 'number' ? heroProduct.price.toFixed(2) : heroProduct.price}
                  </p>
                </div>

                {/* Dark Circular Arrow Button */}
                <div className="w-9 h-9 rounded-full bg-zinc-950 text-white flex items-center justify-center shrink-0 group-hover:bg-[#C5A059] group-hover:text-black transition-colors duration-200">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>

        </div>

      </section>


      {/* ── 2. Trust Badges ── */}
      <section className="bg-white py-10 border-b border-zinc-100">
        <div className="container-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹83,000' },
              { icon: ShieldCheck, title: 'Certified Gems', desc: 'Ethically sourced' },
              { icon: RotateCcw, title: '30-Day Returns', desc: 'Risk-free guarantee' },
              { icon: Gem, title: 'Lifetime Warranty', desc: 'Protect your investment' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center text-[#C5A059]">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">{item.title}</h4>
                  <p className="text-[11px] text-zinc-500 font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Featured Pieces (White, Black & Golden Theme, Supabase Products) ── */}
      <section id="featured" className="py-20 sm:py-28 bg-[#FAFAFA]">
        <div className="container-xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <ScrollAnimate type="fade-up">
              <span className="text-[#C5A059] text-xs uppercase tracking-[0.25em] font-semibold block mb-2">
                ✦ Curated Selection
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-normal text-zinc-950 mb-3">
                Signature Creations
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
                Discover our edit of modern heirlooms — pieces that carry the weight of tradition but are designed for the pulse of today.
              </p>
            </ScrollAnimate>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500">
                <Loader2 className="w-7 h-7 animate-spin text-[#C5A059] mb-4" />
                <span className="text-xs tracking-widest uppercase">Fetching Luméa Archive…</span>
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 8).map((product, i) => (
                <ScrollAnimate key={product.id} type="scale-up" delay={(i * 80) as any}>
                  <ProductCard product={product} />
                </ScrollAnimate>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-zinc-500 font-serif text-lg">
                No creations currently displayed in this archive.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. Category Collections Showcase (From Supabase & Images) ── */}
      <section className="py-20 sm:py-28 bg-white border-t border-zinc-200">
        <div className="container-xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <ScrollAnimate type="fade-up">
              <span className="text-[#C5A059] text-xs uppercase tracking-[0.25em] font-semibold block mb-2">
                ✦ Categories
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-normal text-zinc-950 mb-3">
                Explore The Houses
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
                Every piece is sculpted to balance modern architectural precision with ancestral European benchwork.
              </p>
            </ScrollAnimate>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin text-[#C5A059] mb-3" />
                <span className="text-xs tracking-wider uppercase">Loading Categories…</span>
              </div>
            ) : sortedCategories.length > 0 ? (
              sortedCategories.slice(0, 4).map((cat, i) => {
                const metaKey = cat.name.toLowerCase()
                const meta = categoryMetadata[metaKey] || {
                  desc: 'High Fine Jewelry Archive',
                  fallbackImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
                }
                const imageUrl = cat.image_url || meta.fallbackImage

                return (
                  <ScrollAnimate key={cat.id || cat.name} type="fade-up" delay={i * 90}>
                    <Link
                      href={`/products?category=${encodeURIComponent(cat.name)}`}
                      className="group relative h-96 block overflow-hidden bg-zinc-900 border border-zinc-200 hover:border-[#C5A059] transition-all duration-300 shadow-xs"
                    >
                      <Image
                        src={imageUrl}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

                      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mb-1 font-semibold">
                          House
                        </span>
                        <h3 className="font-serif text-2xl font-normal text-white mb-1">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-zinc-300 font-light mb-4 line-clamp-2">
                          {meta.desc}
                        </p>
                        <div className="inline-flex items-center gap-2 text-xs font-medium text-white group-hover:text-[#C5A059] transition-colors">
                          <span>Discover House</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </ScrollAnimate>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12 text-zinc-500 font-serif">
                No categories available.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 5. Atelier & Heritage Story (White & Golden Theme) ── */}
      <section id="about" className="py-20 sm:py-28 bg-[#FAFAFA] border-t border-zinc-200">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            <div className="lg:col-span-6 relative aspect-[4/4] bg-zinc-100 border border-zinc-300 overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1000&q=80"
                alt="Luméa Master Bench Jeweler"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md border border-zinc-200 text-xs text-zinc-800 shadow-sm">
                <span className="text-[#C5A059] font-semibold uppercase tracking-wider block mb-0.5">Geneva Atelier</span>
                Precision hand-setting of natural diamonds and rare untreated gemstones.
              </div>
            </div>

            <div className="lg:col-span-6 space-y-7">
              <ScrollAnimate type="fade-left">
                <div>
                  <span className="text-[#C5A059] text-xs uppercase tracking-[0.25em] font-semibold block mb-2">
                    ✦ The Luméa Ethos
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-serif font-normal text-zinc-950 leading-tight">
                    Quiet Luxury In Every Facet & Curve
                  </h2>
                </div>
              </ScrollAnimate>

              <ScrollAnimate type="fade-left" delay={100}>
                <p className="text-zinc-700 font-light text-sm sm:text-base leading-relaxed">
                  Luméa was founded upon a singular principle: true luxury needs no noise.
                  Our master goldsmiths and gemologists unite centuries-old hand craftsmanship
                  with sculptural modern silhouettes, forging jewels that whisper distinction.
                </p>
                <p className="text-zinc-600 font-light text-sm leading-relaxed mt-4">
                  Every stone is ethically recovered, hand-selected for exceptional clarity and fire,
                  and set in solid recycled 18-karat gold or platinum.
                </p>
              </ScrollAnimate>

              <ScrollAnimate type="fade-left" delay={200}>
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-200">
                  <div>
                    <h4 className="text-zinc-950 font-serif text-lg mb-1">Sustainable Fine Gold</h4>
                    <p className="text-xs text-zinc-600 font-light">Conflict-free certified metals and traceability from mine to bench.</p>
                  </div>
                  <div>
                    <h4 className="text-zinc-950 font-serif text-lg mb-1">Heirloom Longevity</h4>
                    <p className="text-xs text-zinc-600 font-light">Engineered to be cherished across generations with timeless elegance.</p>
                  </div>
                </div>
              </ScrollAnimate>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-3 bg-black text-white hover:bg-zinc-800 px-7 py-3 text-xs uppercase tracking-widest font-semibold transition-all shadow-sm"
                >
                  <span>Explore The Atelier Works</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. Private Viewing Newsletter (White & Golden Theme) ── */}
      <section className="py-20 sm:py-28 bg-white border-t border-zinc-200">
        <div className="container-xl">
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-semibold block">
              ✦ Luméa Salon
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-zinc-950">
              Private Salon Invitations
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
              Receive private previews of one-of-a-kind bespoke releases and confidential salon invitations.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert("Thank you for joining the Luméa Salon.")
              }}
              className="flex flex-col sm:flex-row gap-3 pt-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 bg-zinc-50 border border-zinc-300 px-4 py-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="bg-black text-white hover:bg-zinc-800 px-6 py-3 text-xs font-semibold tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Request Access
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
