'use client'

import { ScrollAnimate } from '@/components/scroll-animate'
import { Calendar, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { getOrders } from '@/lib/api'
import { useAuth } from '@/app/context/auth-context'

interface Order {
  id: string
  external_id: string
  total: number
  status: string
  created_at: string
  order_items: any[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    async function fetchOrders() {
      if (authLoading) return

      if (!user?.email) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const normalizedEmail = user.email.trim().toLowerCase()
        const data = await getOrders(normalizedEmail)
        setOrders(data || [])
      } catch (error: any) {
        console.error("OrdersPage: Error fetching orders:", error.message || error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user?.email, authLoading])

  if (authLoading || loading) {
    return (
      <div className="bg-white min-h-[60vh] py-20 text-center text-zinc-900">
        <div className="container-xl max-w-4xl">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-48 bg-zinc-100 mx-auto" />
            <div className="h-4 w-72 bg-zinc-100 mx-auto" />
            <div className="space-y-3 pt-6">
              <div className="h-20 w-full bg-zinc-50 border border-zinc-200" />
              <div className="h-20 w-full bg-zinc-50 border border-zinc-200" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white min-h-[70vh] py-16 text-zinc-900 flex items-center justify-center">
        <div className="container-xl max-w-md text-center px-4">
          <div className="bg-zinc-50 border border-zinc-200 p-10 space-y-4 shadow-xs">
            <ShoppingBag className="w-10 h-10 text-[#C5A059] mx-auto" />
            <h2 className="text-2xl font-serif text-zinc-950 font-normal mb-0">Private Access Only</h2>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              Please sign in to view your personalized acquisition history and certificate records.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login" className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider shadow-xs">
                Sign In
              </Link>
              <Link href="/products" className="px-6 py-2.5 bg-white border border-zinc-300 text-zinc-900 text-xs font-medium uppercase tracking-wider shadow-xs">
                Browse Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pt-4 pb-20 text-zinc-900">
      <div className="container-xl max-w-4xl">
        <div className="mb-10 pb-6 border-b border-zinc-200">
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.25em] font-semibold block mb-1">
            ✦ Acquisition Ledger
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal text-zinc-950 mb-1">
            Order History
          </h1>
          <p className="text-xs text-zinc-600 font-light">
            Your collection of acquired fine jewelry creations and delivery records.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-zinc-50 border border-zinc-200 p-14 text-center space-y-4 shadow-xs">
            <ShoppingBag className="w-10 h-10 text-zinc-400 mx-auto" />
            <h2 className="text-2xl font-serif text-zinc-950 font-normal mb-0">No acquisitions recorded</h2>
            <p className="text-xs text-zinc-500 font-light max-w-sm mx-auto">
              Your collection ledger is currently empty. Explore our fine jewelry creations to begin your archive.
            </p>
            <Link 
              href="/products" 
              className="inline-block bg-black text-white hover:bg-zinc-800 px-8 py-3 text-xs font-semibold tracking-wider transition-colors mt-2 shadow-xs"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white border border-zinc-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-[#C5A059] transition shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#C5A059] font-semibold">
                      Ref: #{order.external_id || order.id.slice(0, 8)}
                    </span>
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1.5 font-light">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-zinc-950 mb-0">
                    {order.order_items?.length || 1} {(order.order_items?.length || 1) === 1 ? 'Creation' : 'Creations'} Acquired
                  </h3>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Total Valuation</span>
                    <span className="font-serif text-lg text-zinc-950 font-semibold">₹{Number(order.total).toLocaleString()}</span>
                  </div>

                  <span className="px-3 py-1 text-[10px] uppercase tracking-wider bg-zinc-100 border border-zinc-300 text-zinc-800 font-medium">
                    {order.status || 'Confirmed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
