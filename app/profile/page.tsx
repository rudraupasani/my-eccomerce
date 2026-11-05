'use client'

import { ScrollAnimate } from '@/components/scroll-animate'
import { useAuth } from '@/app/context/auth-context'
import { useWishlist } from '@/app/context/wishlist-context'
import { User, Package, Heart, LogOut } from 'lucide-react'
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
      <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-16 text-zinc-900">
        <div className="text-center max-w-sm bg-zinc-50 border border-zinc-200 p-8 space-y-4 shadow-xs">
          <User className="w-12 h-12 text-[#C5A059] mx-auto" />
          <h1 className="text-2xl font-serif text-zinc-950 font-normal mb-0">Collector Access</h1>
          <p className="text-xs text-zinc-600 font-light leading-relaxed">
            Please sign in to access your Luméa profile, past acquisitions, and private archive.
          </p>
          <Link 
            href="/login" 
            className="w-full py-3 bg-black text-white text-xs font-semibold uppercase tracking-wider block text-center hover:bg-zinc-800 transition-colors shadow-xs"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Private Acquisitions', value: orders.length, icon: Package, href: '/orders' },
    { label: 'Wishlist Curations', value: wishlist.length, icon: Heart, href: '/wishlist' },
  ]

  return (
    <div className="bg-white min-h-screen pt-4 pb-20 text-zinc-900">
      <div className="container-xl max-w-5xl">
        
        {/* Header (Clean spacing) */}
        <div className="mb-10 pb-6 border-b border-zinc-200 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.25em] font-semibold block mb-1">
              ✦ Luméa Member Profile
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-normal text-zinc-950 mb-0">
              Client Archive
            </h1>
            <p className="text-xs text-zinc-600 font-light mt-1">
              {user.email} • Authenticated Collector
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 text-xs text-zinc-600 hover:text-red-600 transition cursor-pointer font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Stats */}
          <div className="lg:col-span-1 space-y-4">
            {stats.map((stat) => (
              <Link 
                key={stat.label} 
                href={stat.href} 
                className="block bg-zinc-50 border border-zinc-200 p-6 hover:border-[#C5A059] transition group shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-zinc-200 flex items-center justify-center text-[#C5A059] shadow-2xs">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-light">{stat.label}</p>
                    <p className="text-2xl font-serif text-zinc-950 font-normal">{stat.value}</p>
                  </div>
                </div>
              </Link>
            ))}

            <div className="bg-zinc-50 border border-zinc-200 p-6 space-y-2.5 shadow-xs">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] block font-semibold">Concierge Advisory</span>
              <p className="text-xs text-zinc-600 font-light leading-relaxed">
                Need bespoke jewelry resizing, diamond certification, or private salon appointments?
              </p>
              <a 
                href="mailto:salon@lumea-finejewelry.com" 
                className="inline-block text-xs text-zinc-900 hover:text-[#C5A059] transition-colors underline underline-offset-4 font-medium"
              >
                Contact Private Concierge →
              </a>
            </div>
          </div>

          {/* Account Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 p-6 sm:p-8 space-y-5 shadow-xs">
              <h3 className="font-serif text-xl font-normal text-zinc-950 mb-0">Collector Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider text-[10px] mb-1">Full Legal Name</span>
                  <span className="text-zinc-950 font-medium">{user.user_metadata?.full_name || 'Collector'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider text-[10px] mb-1">Primary Email</span>
                  <span className="text-zinc-950 font-medium">{user.email}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider text-[10px] mb-1">Maison Tier</span>
                  <span className="text-[#C5A059] font-semibold">Luméa Private Salon Tier I</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider text-[10px] mb-1">Bespoke Vault Delivery</span>
                  <span className="text-zinc-950 font-medium">White-Glove Insured</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 p-6 sm:p-8 flex items-center justify-between shadow-xs">
              <div>
                <h4 className="font-serif text-lg text-zinc-950 mb-0">Acquisition History</h4>
                <p className="text-xs text-zinc-500 font-light mt-0.5">View certificates and tracking for your fine jewelry pieces.</p>
              </div>
              <Link 
                href="/orders" 
                className="px-5 py-2.5 bg-black text-white hover:bg-zinc-800 text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs"
              >
                View Orders
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
