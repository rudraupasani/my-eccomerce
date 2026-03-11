'use client'

import Link from 'next/link'
import { useCart } from '@/app/context/cart-context'
import { useAuth } from '@/app/context/auth-context'
import { ShoppingBag, Search, Menu, X, User, LogOut, ChevronDown, Package, Heart } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const { itemCount } = useCart()
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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
      <div className="bg-accent text-white py-3 text-[9px] font-black tracking-[0.5em] uppercase text-center">
        Legacy Collection • Private Viewing Available
      </div>

      {/* ── Main Nav Bar ── */}
      <div className="bg-white border-b-2 border-accent/10">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 h-20 flex items-center gap-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <span className="text-accent text-3xl font-light">✦</span>
            <span className="text-xl md:text-2xl font-black tracking-[0.3em] text-accent">LUXORA</span>
          </Link>

          {/* Navigation Strip */}
          <nav className="hidden xl:flex items-center gap-10 ml-12">
            {[
              { label: 'High Jewelry', href: '/products' },
              { label: 'Rings', href: '/products?category=Rings' },
              { label: 'Necklaces', href: '/products?category=Necklaces' },
              { label: 'Archive', href: '#' },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[10px] font-black uppercase tracking-[0.25em] text-accent/80 hover:text-accent transition-colors py-4 border-b-2 border-transparent hover:border-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search (Shadowless) */}
          <div className="flex-1 hidden lg:flex items-center max-w-md ml-auto">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="SEARCH ARCHIVE..."
                className="w-full bg-secondary border-b-2 border-accent/20 rounded-full py-4 px-6 text-[10px] font-black tracking-[0.2em] text-foreground focus:border-accent transition-all placeholder:text-accent/30 uppercase"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-accent">
                <Search className="w-5 h-5 stroke-[3px]" />
              </button>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-8">

            {/* Account */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-3 py-2 text-foreground group"
              >
                <div className="p-2 border-2 border-transparent group-hover:border-accent transition-all">
                  <User className="w-5 h-5" />
                </div>
                <ChevronDown className={`w-3 h-3 text-accent transition-transform duration-500 ${accountOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-4 w-72 bg-white border-2 border-accent py-6 px-2 z-50 rounded-2xl shadow-xl">
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
              className="relative p-3 border-2 border-accent/10 hover:border-accent transition-colors text-foreground"
            >
              <Heart className="w-5 h-5" />
              {/* Wishlist count badge could go here */}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-3 border-2 border-accent/10 hover:border-accent transition-colors  text-foreground"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-3 -right-3 w-6 h-6 bg-accent text-white text-[10px] font-black rounded-2xl flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b-2 border-accent/10 px-8 py-8 space-y-6">
          {[
            { label: 'High Jewelry', href: '/products' },
            { label: 'Rings', href: '/products?category=Rings' },
            { label: 'Necklaces', href: '/products?category=Necklaces' },
            { label: 'Archive', href: '#' },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
