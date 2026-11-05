'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/app/context/cart-context'
import { useAuth } from '@/app/context/auth-context'
import { useWishlist } from '@/app/context/wishlist-context'
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Package,
  Heart,
  Search as SearchIcon,
  ShieldAlert,
  Home,
  Grid3x3,
  Sparkles,
  Info
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { getCategories } from '@/lib/api'
import { Category } from '@/lib/types'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'

  const { itemCount } = useCart()
  const { user, signOut } = useAuth()
  const { wishlist } = useWishlist()

  const [categories, setCategories] = useState<Category[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [newOpen, setNewOpen] = useState(false)
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const accountRef = useRef<HTMLDivElement>(null)
  const collectionsRef = useRef<HTMLDivElement>(null)
  const newRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Fetch categories from Supabase for navigation
  useEffect(() => {
    async function fetchNavCategories() {
      try {
        const cats = await getCategories()
        if (cats && cats.length > 0) {
          setCategories(cats)
        }
      } catch (err) {
        console.error('Failed to load categories for header:', err)
      }
    }
    fetchNavCategories()
  }, [])

  // Track scroll position
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
      if (collectionsRef.current && !collectionsRef.current.contains(e.target as Node)) {
        setCollectionsOpen(false)
      }
      if (newRef.current && !newRef.current.contains(e.target as Node)) {
        setNewOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account'

  // Is header dark transparent (over the black hero on home page when not scrolled)
  const isDarkTransparent = isHome && !scrolled

  return (
    <>
      {/* ── Top Header Navbar (z-50) ── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isDarkTransparent
          ? 'bg-transparent border-b border-transparent py-4 sm:py-5'
          : 'bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs py-3 sm:py-3.5'
          }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between">

          {/* Left Navigation (Desktop) */}
          <nav className={`hidden lg:flex items-center space-x-7 text-xs tracking-wider font-normal transition-colors ${isDarkTransparent ? 'text-zinc-300' : 'text-zinc-800'
            }`}>
            <Link
              href="/"
              className={`transition-colors py-2 ${isDarkTransparent ? 'hover:text-white' : 'hover:text-black font-medium'
                }`}
            >
              Home
            </Link>

            <Link
              href="/#about"
              className={`transition-colors py-2 ${isDarkTransparent ? 'hover:text-white' : 'hover:text-black font-medium'
                }`}
            >
              About
            </Link>

            {/* Collections Dropdown */}
            <div className="relative" ref={collectionsRef}>
              <button
                onClick={() => {
                  setCollectionsOpen(!collectionsOpen)
                  setNewOpen(false)
                }}
                className={`flex items-center gap-1.5 transition-colors py-2 group cursor-pointer ${isDarkTransparent ? 'hover:text-white' : 'hover:text-black font-medium'
                  }`}
              >
                <span>Collections</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDarkTransparent ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-600 group-hover:text-black'
                  } ${collectionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {collectionsOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-zinc-200 py-3 shadow-xl z-50 animate-in fade-in duration-200">
                  <div className="px-4 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-[#C5A059] uppercase border-b border-zinc-100 mb-1.5">
                    Curated Archives
                  </div>
                  <Link
                    href="/products"
                    onClick={() => setCollectionsOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-zinc-900 hover:text-[#C5A059] hover:bg-zinc-50 transition-colors"
                  >
                    All Collections
                  </Link>
                  {(categories.length > 0
                    ? categories.map(c => ({ label: c.name, href: `/products?category=${encodeURIComponent(c.name)}` }))
                    : [
                      { label: 'Rings', href: '/products?category=Rings' },
                      { label: 'Necklaces', href: '/products?category=Necklaces' },
                      { label: 'Earrings', href: '/products?category=Earrings' },
                      { label: 'Bracelets', href: '/products?category=Bracelets' },
                      { label: 'Watches', href: '/products?category=Watches' },
                    ]
                  ).map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setCollectionsOpen(false)}
                      className="block px-4 py-2 text-xs text-zinc-700 hover:text-black hover:bg-zinc-50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* New Dropdown */}
            <div className="relative" ref={newRef}>
              <button
                onClick={() => {
                  setNewOpen(!newOpen)
                  setCollectionsOpen(false)
                }}
                className={`flex items-center gap-1.5 transition-colors py-2 group cursor-pointer ${isDarkTransparent ? 'hover:text-white' : 'hover:text-black font-medium'
                  }`}
              >
                <span>New</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDarkTransparent ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-600 group-hover:text-black'
                  } ${newOpen ? 'rotate-180' : ''}`} />
              </button>

              {newOpen && (
                <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-zinc-200 py-3 shadow-xl z-50 animate-in fade-in duration-200">
                  <div className="px-4 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-[#C5A059] uppercase border-b border-zinc-100 mb-1.5">
                    Latest Releases
                  </div>
                  {[
                    { label: 'Spring / Summer 2026', href: '/products?filter=latest' },
                    { label: 'Solitaire Aquamarine', href: '/products?category=Necklaces' },
                    { label: 'Private View Editions', href: '/products' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setNewOpen(false)}
                      className="block px-4 py-2 text-xs text-zinc-700 hover:text-black hover:bg-zinc-50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Center Brand Logo (Exact Font: "Luméa") */}
          <div className="flex-1 lg:flex-none text-left lg:text-center">
            <Link href="/" className="inline-block group">
              <span className={`font-serif text-2xl sm:text-3xl tracking-[0.18em] font-normal transition-colors ${isDarkTransparent ? 'text-white' : 'text-zinc-950'
                }`}>
                Luméa
              </span>
            </Link>
          </div>

          {/* Right Action Icons & Login (Desktop & Tablet) */}
          <div className={`flex items-center space-x-4 sm:space-x-6 transition-colors ${isDarkTransparent ? 'text-zinc-300' : 'text-zinc-800'
            }`}>

            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search jewelry"
              className={`p-1.5 transition-colors cursor-pointer ${isDarkTransparent ? 'hover:text-white' : 'hover:text-black'
                }`}
            >
              <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={`hidden md:block relative p-1.5 transition-colors ${isDarkTransparent ? 'hover:text-white' : 'hover:text-black'
                }`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
              {wishlist && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A059] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Bag Icon */}
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className={`hidden md:block relative p-1.5 transition-colors ${isDarkTransparent ? 'hover:text-white' : 'hover:text-black'
                }`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
              {itemCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center ${isDarkTransparent ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Direct Account Icon */}

            {/* User Account or Log In Pill (Desktop / Tablet) */}
            <div className="relative hidden sm:block" ref={accountRef}>
              {user ? (
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${isDarkTransparent
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-200'
                    }`}
                >
                  <User className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="max-w-[80px] sm:max-w-[110px] truncate">{displayName}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-500" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className={`text-xs font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-xs inline-flex items-center justify-center ${isDarkTransparent
                    ? 'bg-white text-black hover:bg-zinc-200'
                    : 'bg-black text-white hover:bg-zinc-800'
                    }`}
                >
                  Log In
                </Link>
              )}

              {/* Desktop Account Dropdown */}
              {user && accountOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-zinc-200 py-2 rounded-sm shadow-xl z-50 animate-in fade-in duration-200">
                  <div className="px-4 py-2 border-b border-zinc-100">
                    <p className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-wider">Signed In As</p>
                    <p className="text-xs text-zinc-900 truncate font-medium">{user.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-700 hover:text-black hover:bg-zinc-50 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-700 hover:text-black hover:bg-zinc-50 transition-colors"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Order History</span>
                  </Link>

{user && user.email === 'rudraupasani2007@gmail.com' && (
                  <Link
                    href="/admin"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#C5A059] hover:bg-zinc-50 transition-colors font-medium"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Admin Console</span>
                  </Link>
                )}

                  <div className="border-t border-zinc-100 my-1"></div>

                  <button
                    onClick={() => {
                      signOut()
                      setAccountOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-1.5 transition-colors cursor-pointer ${isDarkTransparent ? 'text-zinc-300 hover:text-white' : 'text-zinc-800 hover:text-black'
                }`}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── Search Bar Dropdown Overlay ── */}
        {searchOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-zinc-200 py-4 px-4 sm:px-12 shadow-md animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <SearchIcon className="w-5 h-5 text-zinc-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search timeless necklaces, solitaire rings, earrings..."
                className="w-full bg-transparent border-0 border-b border-zinc-300 pb-2 text-zinc-900 placeholder:text-zinc-400 text-sm focus:outline-none focus:border-[#C5A059] transition-colors"
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-widest text-[#C5A059] hover:text-black font-semibold px-3 py-1 cursor-pointer"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-zinc-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ── Mobile Slide-Out Drawer (Comprehensive with Login, Profile, Collections & About) ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end lg:hidden animate-in fade-in duration-200">
          <div className="w-[85%] max-w-sm h-full bg-white flex flex-col pt-6 pb-20 px-6 overflow-y-auto shadow-2xl">

            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <span className="font-serif text-2xl tracking-[0.18em] text-zinc-950 font-normal">
                Luméa
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 text-zinc-600 hover:text-black cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User / Authentication Status Banner */}
            <div className="my-5 p-4 bg-zinc-50 border border-zinc-200 rounded-xs">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 border border-[#C5A059] flex items-center justify-center text-[#C5A059] font-serif font-bold text-sm">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-900 truncate">{displayName}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-200/80">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="text-center py-2 bg-white border border-zinc-200 text-xs font-medium text-zinc-800 hover:border-black"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="text-center py-2 bg-white border border-zinc-200 text-xs font-medium text-zinc-800 hover:border-black"
                    >
                      Orders
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-center">
                  <div className="text-xs text-zinc-700">
                    <span className="font-serif text-sm font-medium text-zinc-950 block">Private Salon Access</span>
                    Sign in to view curated orders & your personal archive.
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider text-center"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 py-2.5 bg-white border border-zinc-300 text-zinc-900 text-xs font-medium uppercase tracking-wider text-center"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Sections */}
            <div className="space-y-6">

              {/* Primary Links */}
              <div className="space-y-2 border-b border-zinc-100 pb-4">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-base font-serif text-zinc-900 hover:text-[#C5A059]"
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </Link>
                <Link
                  href="/#about"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-base font-serif text-zinc-900 hover:text-[#C5A059]"
                >
                  <span>About Luméa Maison</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </Link>
              </div>

              {/* Collections Accordion / Full Links */}
              <div>
                <button
                  onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                  className="w-full flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-widest text-[#C5A059]"
                >
                  <span>Collections & Houses</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileCollectionsOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileCollectionsOpen && (
                  <div className="space-y-2 pt-2 pl-3 border-l-2 border-[#C5A059]/30">
                    <Link
                      href="/products"
                      onClick={() => setMenuOpen(false)}
                      className="block py-1.5 text-xs font-medium text-zinc-900 hover:text-[#C5A059]"
                    >
                      ✦ All High Jewelry Catalog
                    </Link>
                    {(categories.length > 0
                      ? categories.map(cat => ({ label: cat.name, href: `/products?category=${encodeURIComponent(cat.name)}` }))
                      : [
                        { label: 'Rings & Solitaires', href: '/products?category=Rings' },
                        { label: 'Pendant Necklaces', href: '/products?category=Necklaces' },
                        { label: 'Earrings & Drops', href: '/products?category=Earrings' },
                        { label: 'Bracelets & Cuffs', href: '/products?category=Bracelets' },
                        { label: 'Watches & Timepieces', href: '/products?category=Watches' },
                      ]
                    ).map(cat => (
                      <Link
                        key={cat.label}
                        href={cat.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-1.5 text-xs text-zinc-600 hover:text-black font-light"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Account & Support Links */}
              <div className="pt-2 border-t border-zinc-100 space-y-2.5 text-xs text-zinc-700">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold block mb-1">
                  Private Client Services
                </span>
                <Link
                  href="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className=" flex items-center justify-between py-1.5 text-zinc-800 hover:text-black"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#C5A059]" />
                    My Wishlist
                  </span>
                  {wishlist && wishlist.length > 0 && (
                    <span className="text-[10px] font-bold bg-[#C5A059] text-black px-2 py-0.5 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-1.5 text-zinc-800 hover:text-black"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                    Shopping Bag
                  </span>
                  {itemCount > 0 && (
                    <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full">
                      {itemCount}
                    </span>
                  )}
                </Link>
                {user && user.email === 'rudraupasani2007@gmail.com' && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 py-1.5 text-[#C5A059] font-medium"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Admin Console
                  </Link>
                )}
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="mt-auto pt-6 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
              <span>© Luméa Fine Jewelry</span>
              {user && (
                <button
                  onClick={() => {
                    signOut()
                    setMenuOpen(false)
                  }}
                  className="text-red-600 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  )
}
