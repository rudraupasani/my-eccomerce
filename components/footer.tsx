import Link from 'next/link'
import { Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#FAFAFA] text-zinc-700 pt-20 pb-20 lg:pb-14 border-t border-zinc-200">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 md:px-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">

          {/* Brand & Ethos */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl sm:text-4xl tracking-[0.2em] text-zinc-950 font-normal">
                Luméa
              </span>
            </Link>
            <p className="text-zinc-600 font-light text-xs sm:text-sm leading-relaxed max-w-sm">
              "Jewelry That Speaks In Quiet Luxury. Handcrafted with precious metals and natural gemstones in limited atelier batches."
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
                { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
                { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 border border-zinc-300 bg-white flex items-center justify-center text-zinc-600 hover:text-black hover:border-black transition-colors shadow-xs"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Collections Archive */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              Archives
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: 'All Collections', href: '/products' },
                { label: 'Rings & Solitaires', href: '/products?category=Rings' },
                { label: 'Pendant Necklaces', href: '/products?category=Necklaces' },
                { label: 'Earrings', href: '/products?category=Earrings' },
                { label: 'Bracelets & Cuffs', href: '/products?category=Bracelets' },
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-zinc-600 hover:text-black transition-colors font-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* House of Luméa */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              The House
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: 'Geneva Atelier', href: '/#about' },
                { label: 'Ethical Gemology', href: '/#about' },
                { label: 'Care & Restoration', href: '/#about' },
                { label: 'Private Appointments', href: '/#featured' },
                { label: 'Admin Console', href: '/admin' },
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-zinc-600 hover:text-black transition-colors font-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Concierge & Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              Private Concierge
            </h4>
            <div className="space-y-3 text-xs font-light text-zinc-600">
              <p>
                <span className="text-zinc-900 block font-medium">Client Advisory:</span>
                salon@lumea-finejewelry.com
              </p>
              <p>
                <span className="text-zinc-900 block font-medium">Salon Hours:</span>
                Monday – Saturday, 10:00 – 18:00 CET
              </p>
              <p className="pt-1">
                <Link 
                  href="/admin" 
                  className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] hover:text-black transition-colors font-medium"
                >
                  <span>Portal Management</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-light">
          <p>© {new Date().getFullYear()} Luméa High Fine Jewelry. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-800 transition-colors">Privacy Notice</Link>
            <Link href="/terms" className="hover:text-zinc-800 transition-colors">Terms of Service</Link>
            <Link href="/certificate" className="hover:text-zinc-800 transition-colors">Gem Certificate</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
