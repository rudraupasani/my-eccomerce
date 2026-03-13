'use client'

import Link from 'next/link'
import { useCart } from '@/app/context/cart-context'
import { useAuth } from '@/app/context/auth-context'
import { ShoppingBag, Menu, X, User, LogOut, ChevronDown, Package, Heart, Home, Grid3x3, Search as SearchIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const { itemCount } = useCart()
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Account'

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-500">
      {/* ── Top Bar (Strict Gold) ── */}
      <div className="bg-accent text-white py-2.5 text-[8px] sm:text-[9px] font-black tracking-[0.4em] sm:tracking-[0.5em] uppercase text-center">
        Legacy Collection • Private Viewing Available
      </div>

      {/* ── Main Nav Bar ── */}
      <div className="bg-white border-b-2 border-accent/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-16 h-16 sm:h-20 flex items-center justify-between gap-4 sm:gap-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
            <span className="text-accent text-2xl sm:text-3xl font-light">✦</span>
            <span className="text-base sm:text-xl md:text-2xl font-black tracking-[0.2em] sm:tracking-[0.3em] text-accent  xs:inline">LUXORA</span>
          </Link>

          {/* Navigation Strip (Desktop Only) */}
          <nav className="hidden xl:flex items-center gap-8 ml-8">
            {[
              { label: 'High Jewelry', href: '/products' },
              { label: 'Rings', href: '/products?category=Rings' },
              { label: 'Necklaces', href: '/products?category=Necklaces' },
              { label: 'Earrings', href: '/products?category=Earrings' },
              { label: 'Watches', href: '/products?category=Watches' },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[9px] font-black uppercase tracking-[0.2em] text-accent/70 hover:text-accent transition-colors py-4 border-b-2 border-transparent hover:border-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3 sm:gap-6">

            {/* Account (Hidden on Mobile) */}
            <div className="relative hidden sm:block" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 py-2 text-foreground group"
              >
                <div className="p-2 border-2 border-transparent group-hover:border-accent transition-all">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <ChevronDown className={`w-3 h-3 text-accent transition-transform duration-500 ${accountOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-4 w-64 bg-white border-2 border-accent py-6 px-2 z-50 rounded-2xl shadow-xl">
                  {user ? (
                    <div className="space-y-1 px-6">
                      <div className="pb-4 border-b border-accent/10 mb-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">Member</div>
                        <div className="text-[10px] font-black truncate text-accent/60 uppercase tracking-widest">{user.email}</div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 py-3 text-[10px] font-black uppercase tracking-widest hover:text-accent transition"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 py-3 text-[10px] font-black uppercase tracking-widest hover:text-accent transition"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>
                      <button
                        onClick={() => { signOut(); setAccountOpen(false) }}
                        className="flex items-center gap-3 w-full py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 px-6">
                      <Link
                        href="/login"
                        onClick={() => setAccountOpen(false)}
                        className="block py-4 text-[10px] font-black uppercase tracking-widest hover:text-accent border-b border-accent/5 transition"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setAccountOpen(false)}
                        className="block py-4 text-[10px] font-black uppercase tracking-widest hover:text-accent transition"
                      >
                        Create account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 sm:p-3 border-2 border-accent/10 hover:border-accent transition-colors text-foreground hidden sm:flex"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 sm:p-3 border-2 border-accent/10 hover:border-accent transition-colors text-foreground"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-accent text-white text-[8px] sm:text-[10px] font-black rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {menuOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Quick Nav Bar ── */}


      {/* ── Mobile Nav Menu ── */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b-2 border-accent/10 px-6 py-6 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">
          {/* Mobile Account Section */}
          <div className="sm:hidden pb-4 border-b border-accent/10">
            {user ? (
              <div className="space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">Member</div>
                <div className="text-[10px] font-black truncate text-accent/60 uppercase tracking-widest">{user.email}</div>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[10px] font-black uppercase tracking-widest hover:text-accent transition"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[10px] font-black uppercase tracking-widest hover:text-accent transition"
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </Link>
                <button
                  onClick={() => { signOut(); setMenuOpen(false) }}
                  className="flex items-center gap-3 w-full py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-[10px] font-black uppercase tracking-widest hover:text-accent border-b border-accent/5 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-[10px] font-black uppercase tracking-widest hover:text-accent transition"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <nav className="space-y-2">
            {[
              { label: 'High Jewelry', href: '/products' },
              { label: 'Rings', href: '/products?category=Rings' },
              { label: 'Necklaces', href: '/products?category=Necklaces' },
              { label: 'Earrings', href: '/products?category=Earrings' },
              { label: 'Watches', href: '/products?category=Watches' },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-bold uppercase tracking-wider py-2 px-4 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Wishlist Link */}
          <div className="pt-4 border-t border-accent/10 sm:hidden">
            <Link
              href="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm font-bold uppercase tracking-wider hover:text-accent transition"
            >
              <Heart className="w-4 h-4" />
              My Wishlist
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
