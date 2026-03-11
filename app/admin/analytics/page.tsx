'use client'

import { useState, useEffect } from 'react'
import { getOrders } from '@/lib/api'
import { AdminHeader } from '@/components/admin-header'
import { AdminSidebar } from '@/components/admin-sidebar'
import { ScrollAnimate } from '@/components/scroll-animate'
import {
   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
   AreaChart, Area, PieChart, Pie, Cell
} from 'recharts'
import {
   TrendingUp,
   DollarSign,
   ShoppingCart,
   Target,
   ChevronRight,
   ArrowUpRight,
   TrendingDown,
   Loader2,
   Calendar
} from 'lucide-react'
import Link from 'next/link'

export default function AdminAnalyticsPage() {
   const [orders, setOrders] = useState<any[]>([])
   const [loading, setLoading] = useState(true)
   const [totalRevenue, setTotalRevenue] = useState(0)
   const [aov, setAov] = useState(0)
   const [salesTrend, setSalesTrend] = useState<any[]>([])
   const [categoryData, setCategoryData] = useState<any[]>([])

   useEffect(() => {
      async function loadData() {
         try {
            setLoading(true)
            const data = await getOrders()
            setOrders(data || [])

            if (data && data.length > 0) {
               // 1. Basic Stats
               const revenue = data.reduce((sum, o) => sum + Number(o.total), 0)
               setTotalRevenue(revenue)
               setAov(revenue / data.length)

               // 2. Sales Trend (by day/month)
               const trendMap = data.reduce((acc: any, o) => {
                  const date = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  acc[date] = (acc[date] || 0) + Number(o.total)
                  return acc
               }, {})

               const trendArray = Object.entries(trendMap)
                  .map(([name, value]) => ({ name, value }))
                  .reverse() // Correct chronological order (latest last)
                  .slice(-10) // Last 10 days of activity

               setSalesTrend(trendArray)

               // 3. Category Share
               const catMap = data.reduce((acc: any, o) => {
                  o.order_items?.forEach((item: any) => {
                     const catName = item.products?.categories?.name || 'Archive'
                     acc[catName] = (acc[catName] || 0) + (Number(item.price) * item.quantity)
                  })
                  return acc
               }, {})

               const colors = ['#D4A017', '#1A1A1A', '#666666', '#A3A3A3', '#E5E5E5']
               const catArray = Object.entries(catMap).map(([name, value], i) => ({
                  name,
                  value,
                  color: colors[i % colors.length]
               }))
               setCategoryData(catArray)
            }
         } catch (err) {
            console.error("Failed to load analytics:", err)
         } finally {
            setLoading(false)
         }
      }
      loadData()
   }, [])

   const stats = [
      { label: 'Gross Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12%', positive: true },
      { label: 'Total Acquisitions', value: orders.length.toString(), icon: ShoppingCart, trend: '+5%', positive: true },
      { label: 'Average Value', value: `$${aov.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: Target, trend: '-2%', positive: false },
   ]

   if (loading) {
      return (
         <div className="flex min-h-screen bg-background">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
               <AdminHeader />
               <main className="flex-1 p-8 flex items-center justify-center">
                  <div className="text-center space-y-4">
                     <Loader2 className="w-10 h-10 animate-spin text-accent mx-auto" />
                     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Synthesize Data Stream...</p>
                  </div>
               </main>
            </div>
         </div>
      )
   }

   return (
      <div className="flex min-h-screen bg-background">
         <div className="flex-1 flex flex-col">

            <main className="flex-1 p-8 lg:p-12 overflow-auto space-y-12">

               {/* Header */}
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <ScrollAnimate type="fade-down">
                     <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                        <span>Admin</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-accent">Analytics</span>
                     </div>
                     <h1 className="text-4xl font-bold mb-2 tracking-tighter uppercase italic">Strategic Insights</h1>
                     <p className="text-muted-foreground">Depth analysis of luxury acquisitions and revenue vectors</p>
                  </ScrollAnimate>
                  <div className="flex items-center gap-3">
                     <button className="bg-secondary/50 border border-border px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-secondary transition">
                        <Calendar className="w-4 h-4" />
                        Period: All Time
                     </button>
                  </div>
               </div>

               {/* Quick Stats */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats.map((stat, i) => {
                     const Icon = stat.icon
                     return (
                        <ScrollAnimate key={stat.label} type="scale-up" delay={i * 100}>
                           <div className="bg-card border border-border p-8 rounded-[32px] shadow-sm relative overflow-hidden group hover:border-accent/40 transition-colors">
                              <div className="flex items-center justify-between mb-8">
                                 <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6" />
                                 </div>
                                 <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${stat.positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                                    }`}>
                                    {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {stat.trend}
                                 </div>
                              </div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
                              <h3 className="text-4xl font-black tracking-tighter italic">{stat.value}</h3>

                              {/* Background accent */}
                              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                 <Icon className="w-32 h-32 rotate-12" />
                              </div>
                           </div>
                        </ScrollAnimate>
                     )
                  })}
               </div>

               {/* Charts Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                  {/* Main Trend Chart */}
                  <ScrollAnimate type="fade-up" className="lg:col-span-2">
                     <div className="bg-card border border-border rounded-[40px] p-10 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-12">
                           <div>
                              <h3 className="text-xl font-bold uppercase italic tracking-tight">Revenue Trajectory</h3>
                              <p className="text-xs text-muted-foreground mt-1 font-medium">Historical performance over recent activity</p>
                           </div>
                           <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Growth Vector</span>
                           </div>
                        </div>

                        <div className="h-[350px] w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={salesTrend}>
                                 <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                                       <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                                    </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                 <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                                 />
                                 <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                                    tickFormatter={(val) => `$${val}`}
                                 />
                                 <Tooltip
                                    contentStyle={{
                                       backgroundColor: 'hsl(var(--card))',
                                       border: '1px solid hsl(var(--border))',
                                       borderRadius: '16px',
                                       boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
                                       fontSize: '12px',
                                       fontWeight: '900'
                                    }}
                                 />
                                 <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--accent))"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                 />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </ScrollAnimate>

                  {/* Category Mixture */}
                  <ScrollAnimate type="fade-up" delay={150}>
                     <div className="bg-card border border-border rounded-[40px] p-10 shadow-sm h-full flex flex-col">
                        <h3 className="text-xl font-bold uppercase italic tracking-tight mb-2">Archive Mix</h3>
                        <p className="text-xs text-muted-foreground font-medium mb-12">Revenue distribution by category</p>

                        <div className="flex-1 min-h-[250px] relative">
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie
                                    data={categoryData}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                 >
                                    {categoryData.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                 </Pie>
                                 <Tooltip
                                    contentStyle={{ border: 'none', borderRadius: '12px', background: 'hsl(var(--card))', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                                 />
                              </PieChart>
                           </ResponsiveContainer>
                           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <span className="text-2xl font-black text-foreground italic">{categoryData.length}</span>
                              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">Segments</span>
                           </div>
                        </div>

                        <div className="mt-12 space-y-5">
                           {categoryData.slice(0, 4).map(item => (
                              <div key={item.name} className="flex items-center justify-between group">
                                 <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full group-hover:scale-125 transition-transform" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
                                 </div>
                                 <span className="text-xs font-black tracking-tighter">${item.value.toLocaleString()}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </ScrollAnimate>
               </div>

               {/* Latest Activity Stream */}
               <ScrollAnimate type="fade-up">
                  <div className="bg-card border border-border rounded-[40px] overflow-hidden shadow-sm">
                     <div className="p-10 border-b border-border flex items-center justify-between">
                        <div>
                           <h3 className="text-xl font-bold uppercase italic tracking-tight">Activity Feed</h3>
                           <p className="text-xs text-muted-foreground font-medium mt-1">Real-time chronicle of luxury acquisitions</p>
                        </div>
                        <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-accent border-b-2 border-accent/20 pb-1 hover:border-accent transition-colors">
                           Full Ledger
                        </Link>
                     </div>

                     <div className="divide-y divide-border">
                        {orders.slice(0, 5).map((order) => (
                           <div key={order.id} className="p-8 hover:bg-secondary/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-accent/40 group-hover:text-accent group-hover:scale-105 transition-all">
                                    <ShoppingCart className="w-6 h-6" />
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-3 mb-1">
                                       <span className="text-[10px] font-black uppercase tracking-tighter bg-accent/5 px-2.5 py-1 rounded-md text-accent border border-accent/10 italic">#{order.external_id}</span>
                                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <h4 className="font-bold text-foreground">{order.shipping_address?.name || 'Private Client'}</h4>
                                 </div>
                              </div>
                              <div className="flex items-center gap-10">
                                 <div className="text-right">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Value</p>
                                    <p className="text-xl font-black tracking-tighter italic text-accent">${Number(order.total).toLocaleString()}</p>
                                 </div>
                                 <Link href={`/admin/orders/${order.id}`} className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                 </Link>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </ScrollAnimate>

            </main>
         </div>
      </div>
   )
}
