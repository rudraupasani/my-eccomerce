'use client'

import { ScrollAnimate } from '@/components/scroll-animate'
import { Card } from '@/components/ui/card'
import { Package, ChevronRight, Calendar, Clock, ArrowRight, ShoppingBag } from 'lucide-react'
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

      console.log("OrdersPage: Auth loaded. User:", user?.email)

      if (!user?.email) {
        console.log("OrdersPage: No user logged in.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const normalizedEmail = user.email.trim().toLowerCase()
        console.log("OrdersPage: Requesting orders for:", normalizedEmail)

        const data = await getOrders(normalizedEmail)
        console.log("OrdersPage: Success. Count:", data?.length || 0)

        if (data && data.length > 0) {
          console.table(data.map(o => ({ id: o.external_id, status: o.status, email: o.customer_email })))
        }

        setOrders(data || [])
      } catch (error: any) {
        console.error("OrdersPage: Fatal Fetch Error:", error.message || error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user?.email, authLoading])

  if (authLoading || loading) {
    return (
      <div className="bg-background min-h-screen pt-40 pb-24">
        <div className="container-xl max-w-4xl text-center">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 bg-secondary mx-auto rounded-full" />
            <div className="h-4 w-96 bg-secondary mx-auto rounded-full opacity-40" />
            <div className="space-y-4 pt-12">
              <div className="h-32 w-full bg-secondary rounded-3xl" />
              <div className="h-32 w-full bg-secondary rounded-3xl opacity-50" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-background min-h-screen pt-40 pb-24">
        <div className="container-xl max-w-2xl text-center px-4">
          <ScrollAnimate type="scale-up" className="bg-card border border-border p-16 rounded-[40px] shadow-sm">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-10">
              <ShoppingBag className="w-8 h-8 text-accent/40" />
            </div>
            <h2 className="text-3xl font-bold mb-6 italic tracking-tight uppercase">Private Access Only</h2>
            <p className="text-muted-foreground mb-12 max-w-xs mx-auto uppercase text-[10px] font-bold tracking-[0.2em] leading-loose">
              Please sign in to view your personalized acquisition history and private collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link href="/login" className="btn-primary px-12 py-5 w-full sm:w-auto">Secure Sign In</Link>
              <Link href="/products" className="btn-secondary px-12 py-5 w-full sm:w-auto">Browse Archive</Link>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pt-10 pb-20">
      <div className="container-xl max-w-4xl">
        <ScrollAnimate type="fade-down" className="mb-12">
          <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block text-center md:text-left">Archive History</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-center md:text-left">My Orders</h1>
          <p className="text-foreground/40 font-medium italic text-center md:text-left">Your collection of luxury pieces and acquisitions.</p>
        </ScrollAnimate>

        {orders.length === 0 ? (
          <ScrollAnimate type="scale-up">
            <div className="bg-card border border-accent/10 p-20 rounded-[40px] text-center shadow-sm">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-10 border border-border">
                <ShoppingBag className="w-10 h-10 text-accent/10" />
              </div>
              <h2 className="text-3xl font-bold mb-6 italic tracking-tight uppercase">No acquisitions found</h2>
              <p className="text-muted-foreground mb-12 max-w-sm mx-auto uppercase text-[10px] font-bold tracking-[0.2em] leading-loose">
                Your private collection is currently empty. Begin your legacy by exploring our masterworks.
              </p>
              <Link href="/products" className="btn-primary px-12 py-5">Explore Archive</Link>
            </div>
          </ScrollAnimate>
        ) : (
          <div className="space-y-6">
            {orders.map((order, i) => (
              <ScrollAnimate key={order.id} type="fade-up" delay={i * 100}>
                <Link href={`/orders/${order.external_id}`} className="block group">
                  <div className="bg-card border border-accent/10 hover:border-accent/40 p-8 md:p-10 rounded-[32px] transition-all shadow-sm group-hover:shadow-2xl group-hover:shadow-accent/5 group-hover:-translate-y-1 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-accent tracking-tighter bg-accent/5 px-4 py-1.5 rounded-full border border-accent/10 uppercase italic">Ref: {order.external_id}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                          {order.order_items?.length || 0} {(order.order_items?.length || 0) === 1 ? 'Piece' : 'Pieces'} <span className="text-accent/40">Acquired</span>
                        </h3>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-10">
                        <div className="text-left md:text-right">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 opacity-60">Total Value</p>
                          <p className="text-2xl font-black text-foreground tracking-tighter italic">₹{Number(order.total).toLocaleString()}</p>
                        </div>
                        <div className="hidden sm:flex flex-col items-center">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full border-2 ${order.status === 'Delivered'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            : 'bg-secondary border-border text-accent'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-500">
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Subtle BG number */}
                    <div className="absolute -bottom-10 -left-10 text-[160px] font-black text-accent/3 select-none pointer-events-none italic tracking-tighter">
                      {String(orders.length - i).padStart(2, '0')}
                    </div>
                  </div>
                </Link>
              </ScrollAnimate>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
