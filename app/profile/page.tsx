'use client'

import { ScrollAnimate } from '@/components/scroll-animate'
import { useAuth } from '@/app/context/auth-context'
import { useWishlist } from '@/app/context/wishlist-context'
import { User, Package, Heart, LogOut, Shield, MapPin, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { wishlist } = useWishlist()
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const savedOrders = localStorage.getItem('user-orders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <ScrollAnimate type="scale-up" className="text-center max-w-sm bg-card border border-accent/10 p-12 rounded-3xl shadow-sm">
          <User className="w-16 h-16 text-accent/20 mx-auto mb-8" />
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">Account Restricted</h1>
          <p className="text-sm text-muted-foreground mb-10 leading-loose">Please sign in to view your private collection and profile archive.</p>
          <Link href="/login" className="btn-primary w-full block">Sign In</Link>
        </ScrollAnimate>
      </div>
    )
  }

  const stats = [
    { label: 'Acquisitions', value: orders.length, icon: Package, href: '/orders' },
    { label: 'Wishlist', value: wishlist.length, icon: Heart, href: '/wishlist' },
  ]

  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="container-xl max-w-5xl">
        <ScrollAnimate type="fade-down" className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Collector Profile</span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Archive #{user.email?.split('@')[0]}</h1>
            <p className="text-foreground/40 font-medium italic">Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>
        </ScrollAnimate>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats & Briefs */}
          <div className="lg:col-span-1 space-y-8">
            {stats.map((stat, i) => (
              <ScrollAnimate key={stat.label} type="fade-right" delay={i * 100}>
                <Link href={stat.href} className="group block h-full">
                  <div className="bg-card border border-accent/10 p-8 rounded-3xl hover:border-accent transition duration-500 shadow-sm group-hover:shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-14 h-14 bg-accent/5 rounded-2xl flex items-center justify-center text-accent">
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</p>
                      </div>
                    </div>
                    {/* Abstract BG number */}
                    <div className="absolute -bottom-6 -right-6 text-7xl font-black text-accent/5 italic select-none">
                      {stat.value}
                    </div>
                  </div>
                </Link>
              </ScrollAnimate>
            ))}
          </div>

          {/* Detailed Info */}
          <div className="lg:col-span-2 space-y-8">
            <ScrollAnimate type="fade-left">
              <div className="bg-card border border-accent/10 px-10 py-12 rounded-3xl shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest mb-10 pb-4 border-b border-accent/10">Archive Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Shield className="w-5 h-5 text-accent mt-1" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Identity</p>
                        <p className="text-sm font-bold text-foreground">{user.email}</p>
                        <p className="text-[10px] text-accent font-bold mt-1 uppercase tracking-tighter">Verified Private Collector</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Calendar className="w-5 h-5 text-accent mt-1" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Last Concierge Visit</p>
                        <p className="text-sm font-bold text-foreground">Recently Active</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-accent mt-1" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Preferred Region</p>
                        <p className="text-sm font-bold text-foreground italic flex items-center gap-2">
                          Not set
                          <span className="text-[10px] text-accent/40 font-black cursor-pointer hover:text-accent transition underline uppercase">Edit</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimate>

            {/* Quick Links */}
            <ScrollAnimate type="fade-up" delay={200}>
              <div className="bg-secondary/50 border border-accent/10 p-8 rounded-3xl flex flex-wrap gap-4">
                <Link href="/products" className="flex items-center gap-3 px-6 py-4 bg-white border border-accent/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-accent transition group">
                  Explore Archive
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/cart" className="flex items-center gap-3 px-6 py-4 bg-white border border-accent/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-accent transition group">
                  Incomplete Acquisitions
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </div>
    </div>
  )
}
