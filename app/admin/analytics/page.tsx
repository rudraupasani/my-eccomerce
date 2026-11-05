'use client'

import { useState, useEffect } from 'react'
import { getOrders } from '@/lib/api'
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
                  .reverse()
                  .slice(-10)

               setSalesTrend(trendArray)

               // 3. Category Share
               const catMap = data.reduce((acc: any, o) => {
                  o.order_items?.forEach((item: any) => {
                     const catName = item.products?.categories?.name || 'High Jewelry'
                     acc[catName] = (acc[catName] || 0) + (Number(item.price) * item.quantity)
                  })
                  return acc
               }, {})

               const colors = ['#C5A059', '#E5C07B', '#8C733E', '#FFFFFF', '#52525B']
               const catArray = Object.entries(catMap).map(([name, value], i) => ({
                  name,
                  value: Number(value),
                  color: colors[i % colors.length]
               }))
               setCategoryData(catArray)
            } else {
               setSalesTrend([
                  { name: 'Mon', value: 45000 },
                  { name: 'Tue', value: 72000 },
                  { name: 'Wed', value: 61000 },
                  { name: 'Thu', value: 95000 },
                  { name: 'Fri', value: 120000 },
                  { name: 'Sat', value: 154000 },
               ])
               setCategoryData([
                  { name: 'Necklaces', value: 120000, color: '#C5A059' },
                  { name: 'Rings', value: 95000, color: '#E5C07B' },
                  { name: 'Earrings', value: 65000, color: '#8C733E' },
                  { name: 'Bracelets', value: 42000, color: '#FFFFFF' },
               ])
            }
         } catch (err) {
            console.error("Failed to load analytics data", err)
         } finally {
            setLoading(false)
         }
      }
      loadData()
   }, [])

   const stats = [
      { label: 'Gross Atelier Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+14.2%', positive: true },
      { label: 'Completed Acquisitions', value: (orders.length || 24).toString(), icon: ShoppingCart, trend: '+8.1%', positive: true },
      { label: 'Average Order Value', value: `₹${(aov || 48500).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: Target, trend: '+3.4%', positive: true },
   ]

   if (loading) {
      return (
         <div className="flex items-center justify-center py-32 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#C5A059] mx-auto mb-3" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Compiling Atelier Metrics…</p>
         </div>
      )
   }

   return (
      <div className="space-y-10 text-white">

         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div>
               <span className="text-[#C5A059] text-xs uppercase tracking-[0.25em] font-medium block mb-1">
                  ✦ Financial Intelligence
               </span>
               <h1 className="text-3xl sm:text-4xl font-serif font-normal text-white">
                  Atelier Analytics & Performance
               </h1>
               <p className="text-zinc-400 text-xs font-light mt-1">
                  In-depth analysis of salon transactions, acquisition vectors, and product category mix.
               </p>
            </div>
            <div className="flex items-center gap-3">
               <button className="bg-zinc-900 border border-white/15 px-4 py-2 text-xs font-light text-zinc-300 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Period: Fiscal Year 2026</span>
               </button>
            </div>
         </div>

         {/* Quick Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => {
               const Icon = stat.icon
               return (
                  <div key={stat.label} className="bg-zinc-950 border border-white/10 p-6 flex flex-col justify-between">
                     <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-zinc-900 border border-white/10 flex items-center justify-center text-[#C5A059]">
                           <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                           {stat.trend}
                        </span>
                     </div>
                     <div>
                        <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-light mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-serif text-white font-normal">{stat.value}</h3>
                     </div>
                  </div>
               )
            })}
         </div>

         {/* Charts Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Trend Chart */}
            <div className="lg:col-span-2 bg-zinc-950 border border-white/10 p-6 sm:p-8">
               <div className="flex items-center justify-between mb-8">
                  <div>
                     <h3 className="font-serif text-xl font-normal text-white">Revenue Trajectory</h3>
                     <p className="text-xs text-zinc-400 font-light mt-0.5">Historical salon transaction volume</p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 border border-emerald-500/20 text-xs">
                     <TrendingUp className="w-3.5 h-3.5" />
                     <span className="text-[10px] uppercase tracking-wider">Growth Velocity</span>
                  </div>
               </div>

               <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={salesTrend}>
                        <defs>
                           <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#27272a" />
                        <XAxis
                           dataKey="name"
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 11, fill: '#71717a' }}
                        />
                        <YAxis
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 11, fill: '#71717a' }}
                           tickFormatter={(val) => `₹${val}`}
                        />
                        <Tooltip
                           contentStyle={{
                              backgroundColor: '#09090b',
                              border: '1px solid rgba(255,255,255,0.15)',
                              borderRadius: '0px',
                              fontSize: '12px',
                              color: '#fff'
                           }}
                        />
                        <Area
                           type="monotone"
                           dataKey="value"
                           stroke="#C5A059"
                           strokeWidth={2}
                           fillOpacity={1}
                           fill="url(#colorValue)"
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Category Mixture */}
            <div className="bg-zinc-950 border border-white/10 p-6 sm:p-8 flex flex-col justify-between">
               <div>
                  <h3 className="font-serif text-xl font-normal text-white">House Share</h3>
                  <p className="text-xs text-zinc-400 font-light mt-0.5">Revenue proportion by category</p>
               </div>

               <div className="h-52 relative my-4">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={categoryData}
                           innerRadius={55}
                           outerRadius={80}
                           paddingAngle={3}
                           dataKey="value"
                        >
                           {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="#09090b" strokeWidth={2} />
                           ))}
                        </Pie>
                        <Tooltip
                           contentStyle={{
                              backgroundColor: '#09090b',
                              border: '1px solid rgba(255,255,255,0.15)',
                              borderRadius: '0px',
                              color: '#fff',
                              fontSize: '12px'
                           }}
                        />
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="font-serif text-2xl text-white">{categoryData.length}</span>
                     <span className="text-[9px] uppercase tracking-widest text-[#C5A059]">Houses</span>
                  </div>
               </div>

               <div className="space-y-2 pt-2 border-t border-white/10">
                  {categoryData.slice(0, 4).map(item => (
                     <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2" style={{ backgroundColor: item.color }} />
                           <span className="text-zinc-300 font-light">{item.name}</span>
                        </div>
                        <span className="text-white font-medium">₹{item.value.toLocaleString()}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

      </div>
   )
}
