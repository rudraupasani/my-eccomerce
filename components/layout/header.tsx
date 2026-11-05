'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif font-bold text-foreground">
            Luxora
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link 
              href="/products"
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              Shop
            </Link>
            <Link 
              href="/about"
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact"
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/admin"
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/cart" className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Mobile menu toggle */}
            <button 
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden flex flex-col gap-4 py-4 border-t border-border">
            <Link 
              href="/products"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/about"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/admin"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
