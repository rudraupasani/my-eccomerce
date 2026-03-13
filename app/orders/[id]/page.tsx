'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { CheckCircle, Package, Truck, Home, ArrowLeft } from 'lucide-react'
import { getOrderById } from '@/lib/api'
import { ScrollAnimate } from '@/components/scroll-animate'

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  products?: {
    name: string
    image_url: string
  }
}

interface Order {
  id: string
  external_id: string
  order_items: OrderItem[]
  total: number
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Alert'
  created_at: string
  estimated_delivery: string
  customer_email: string
  shipping_address: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
}

interface OrderPageProps {
  params: Promise<{ id: string }>
}

export default function OrderPage({ params }: OrderPageProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    params.then(async ({ id }) => {
      setOrderId(id)
      try {
        const data = await getOrderById(id)
        setOrder(data as Order)
      } catch (error) {
        console.error("Failed to fetch order", error)
      } finally {
        setLoading(false)
      }
    })
  }, [params])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 text-center">
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 text-center">
        <h1 className="mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find this order.</p>
        <Link href="/products" className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded font-serif font-semibold hover:bg-accent/90 transition">
          Continue Shopping
        </Link>
      </div>
    )
  }

  const statusSteps = [
    { status: 'Pending', label: 'Order Registered', icon: CheckCircle },
    { status: 'Processing', label: 'Preparing', icon: CheckCircle },
    { status: 'Shipped', label: 'In Transit', icon: Package },
    { status: 'Delivered', label: 'Arrived', icon: Home },
  ]

  // Find index, fallback to 0 for Pending or unknown, manual handle for Alert
  let currentStepIndex = statusSteps.findIndex(s => s.status === order.status)
  if (order.status === 'Alert') currentStepIndex = 1 // Show as processing visually if alerted
  if (currentStepIndex === -1) currentStepIndex = 0

  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="container-xl max-w-4xl">
        <ScrollAnimate type="fade-down" className="mb-12">
          <Link href="/orders" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-6 group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Orders
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Acquisition Detailed</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-0">Order {order.id}</h1>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Order Frequency</p>
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 border border-accent/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-black text-accent uppercase tracking-tighter">{order.status}</span>
              </div>
            </div>
          </div>
        </ScrollAnimate>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Status Timeline Card */}
            <ScrollAnimate type="fade-up">
              <div className="bg-card border border-accent/10 rounded-3xl p-10 shadow-sm relative overflow-hidden">
                <h3 className="text-sm font-black uppercase tracking-widest mb-10 pb-4 border-b border-accent/10">Logistics Timeline</h3>
                <div className="flex justify-between relative px-2">
                  <div className="absolute top-6 left-12 right-12 h-0.5 bg-accent/10 z-0">
                    <div
                      className="h-full bg-accent transition-all duration-1000"
                      style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {statusSteps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = index <= currentStepIndex
                    return (
                      <div key={step.status} className="flex flex-col items-center relative z-10 w-24">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-secondary text-accent/20 border border-accent/10'
                          }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-tighter mt-4 text-center ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </ScrollAnimate>

            {/* Items List */}
            <ScrollAnimate type="fade-up" delay={100}>
              <div className="bg-card border border-accent/10 rounded-3xl p-10 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest mb-8 pb-4 border-b border-accent/10">Pieces in this Order</h3>
                <div className="space-y-6">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="relative w-24 h-24 rounded-2xl bg-secondary overflow-hidden border border-accent/5">
                        <Image
                          src={item.products?.image_url || '/placeholder.png'}
                          alt={item.products?.name || 'Luxury Piece'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <Link href={`/product/${item.product_id}`} className="text-base font-black uppercase tracking-tight hover:text-accent transition-colors">
                          {item.products?.name || 'Luxury Item'}
                        </Link>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">QTY: {item.quantity}</p>
                        <p className="text-lg font-black text-accent mt-2">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimate>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <ScrollAnimate type="fade-left" delay={200}>
              <div className="bg-secondary/50 border border-accent/10 rounded-3xl p-8 space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-4">Destination</h4>
                  <div className="space-y-2 text-sm font-medium">
                    <p className="font-black text-foreground">{order.shipping_address.name}</p>
                    <p className="text-foreground/60">{order.shipping_address.address}</p>
                    <p className="text-foreground/60">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                    <p className="text-foreground/60 italic">{order.shipping_address.country}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-accent/10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-4">Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/40 font-bold uppercase tracking-tighter">Subtotal</span>
                      <span className="font-black">₹{(order.total - (order.total * 0.08)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/40 font-bold uppercase tracking-tighter">Est. Tax</span>
                      <span className="font-black">₹{(order.total * 0.08).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black pt-4 border-t border-accent/20">
                      <span className="uppercase tracking-tighter">Total</span>
                      <span className="text-accent">₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimate>

            <ScrollAnimate type="fade-left" delay={300}>
              <div className="bg-accent p-8 rounded-3xl text-white">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Estimated Delivery</h4>
                <p className="text-2xl font-black tracking-tighter leading-tight">
                  {new Date(order.estimated_delivery).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <div className="mt-8 pt-8 border-t border-white/20">
                  <button className="w-full py-4 bg-white text-accent rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all">
                    Track Shipment
                  </button>
                </div>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </div>
    </div>
  )
}
