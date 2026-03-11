import Link from 'next/link'
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white text-foreground pt-40 pb-20 border-t-4 border-accent">
      <div className="max-w-[1600px] mx-auto px-12 md:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-40">

          {/* Brand & Manifest */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-4 mb-12 group">
              <span className="text-accent text-5xl font-light">✦</span>
              <span className="text-3xl font-black tracking-[0.4em] text-accent">LUXORA</span>
            </Link>
            <p className="text-accent/60 text-2xl leading-relaxed italic max-w-sm mb-16">
              "Elegance is not being noticed, but being remembered."
            </p>
            <div className="flex gap-8">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-accent/30 hover:text-accent transition-all duration-500 transform hover:-translate-y-2"
                >
                  <Icon className="w-6 h-6 stroke-[1.5px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-16">
            {/* Curated Collections */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-accent mb-10">Archive</h4>
              <ul className="space-y-6">
                {[
                  { label: 'Royal Series', href: '/products' },
                  { label: 'Solitaire', href: '/products?category=Rings' },
                  { label: 'Heritage', href: '/products?category=Necklaces' },
                  { label: 'Appraisals', href: '#' },
                ].map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-[10px] font-black uppercase tracking-widest text-accent/60 hover:text-accent transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-accent/90 mb-10">The House</h4>
              <ul className="space-y-6">
                {['Legacy', 'Ethos', 'Locations', 'Archives', 'Atelier'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-[10px] font-black uppercase tracking-widest text-accent/60 hover:text-accent transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Concierge */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-accent/90 mb-10">Private</h4>
              <ul className="space-y-8">
                <li className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent/90">Boutique</span>
                  <span className="text-xs font-black uppercase tracking-widest text-accent/60 leading-relaxed">Fifth Avenue <br /> New York, NY</span>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent/90">Direct</span>
                  <span className="text-xs font-black uppercase tracking-widest text-accent/60">+1 800 LUXORA</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-20 border-t border-accent/10 flex flex-col md:flex-row items-center justify-between gap-12">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-accent/90">© 2025 House of Luxora • Non-Distributed</p>
          <div className="flex gap-16">
            {['Privacy', 'Condition', 'Legal'].map(item => (
              <a key={item} href="#" className="text-[9px] font-black uppercase tracking-[0.4em] text-accent/30 hover:text-accent transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
