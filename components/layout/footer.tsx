import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Luxora</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Exquisite jewelry crafted with precision and elegance.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-muted-foreground hover:text-accent transition-colors">All Products</Link></li>
              <li><Link href="/products?category=necklaces" className="text-muted-foreground hover:text-accent transition-colors">Necklaces</Link></li>
              <li><Link href="/products?category=rings" className="text-muted-foreground hover:text-accent transition-colors">Rings</Link></li>
              <li><Link href="/products?category=bracelets" className="text-muted-foreground hover:text-accent transition-colors">Bracelets</Link></li>
              <li><Link href="/products?category=earrings" className="text-muted-foreground hover:text-accent transition-colors">Earrings</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Returns</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe for exclusive offers and new collections.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-input border border-border rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="px-4 py-2 bg-accent text-accent-foreground rounded-r-lg font-medium hover:bg-accent/90 transition-colors text-sm">
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2024 Luxora. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
