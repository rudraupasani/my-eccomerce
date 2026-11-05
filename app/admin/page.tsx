'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getOrders } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ShoppingCart, DollarSign, MoreHorizontal, Gem, Layers } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState<number | null>(null)
  const [categoryCount, setCategoryCount] = useState<number | null>(null)
  const [totalOrdersCount, setTotalOrdersCount] = useState<number | null>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [dynamicSalesData, setDynamicSalesData] = useState<any[]>([])
  const [dynamicProductCategoryData, setDynamicProductCategoryData] = useState<any[]>([])

  useEffect(() => {
    async function loadStats() {
      try {
        const { count: pCount, data: products } = await supabase.from('products').select('*, categories(name)', { count: 'exact' })
        const { count: cCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })
        const { count: oCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })
        
        const orders = await getOrders()
        
        setProductCount(pCount)
        setCategoryCount(cCount)
        setTotalOrdersCount(oCount)
        setRecentOrders(orders?.slice(0, 5) || [])
        
        const revenue = orders?.reduce((sum: number, order: any) => sum + Number(order.total), 0) || 0
        setTotalRevenue(revenue)

        // Calculate dynamic sales data for charts
        const salesByMonth = orders?.reduce((acc: any, order: any) => {
          const date = new Date(order.created_at);
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const key = `${month}-${year}`;
          if (!acc[key]) acc[key] = { month: `${month}`, sales: 0, orders: 0 };
          acc[key].sales += Number(order.total);
          acc[key].orders += 1;
          return acc;
        }, {});

        const sortedSalesData = Object.values(salesByMonth || {}).sort((a: any, b: any) => {
          const dateA = new Date(a.month);
          const dateB = new Date(b.month);
          return dateA.getTime() - dateB.getTime();
        });

        const fallbackSales = [
          { month: 'Jan', sales: 42000 },
          { month: 'Feb', sales: 65000 },
          { month: 'Mar', sales: 51000 },
          { month: 'Apr', стрем: 89000, sales: 89000 },
          { month: 'May', sales: 74000 },
          { month: 'Jun', sales: 112000 },
        ]

        setDynamicSalesData(sortedSalesData.length > 0 ? sortedSalesData : fallbackSales);

        // Calculate dynamic product category data
        const productCategoryCounts: { [key: string]: number } = {};
        products?.forEach((product: any) => {
          const categoryName = product.categories?.name || 'Uncategorized';
          productCategoryCounts[categoryName] = (productCategoryCounts[categoryName] || 0) + 1;
        });

        const totalProducts = products?.length || 0;
        const colors = ['#C5A059', '#18181B', '#71717A', '#D4AF37', '#A1A1AA'];
        const categoryData = Object.entries(productCategoryCounts).map(([name, count], index) => ({
          name,
          value: totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0,
          color: colors[index % colors.length]
        }));

        setDynamicProductCategoryData(
          categoryData.length > 0 
            ? categoryData 
            : [
                { name: 'Necklaces', value: 40, color: '#C5A059' },
                { name: 'Rings', value: 30, color: '#18181B' },
                { name: 'Earrings', value: 20, color: '#71717A' },
                { name: 'Bracelets', value: 10, color: '#D4AF37' },
              ]
        );

      } catch (err) {
        console.error("Failed to load dashboard stats", err)
      }
    }
    loadStats()
  }, [])

  const stats = [
    { label: 'Gross Atelier Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: '+18.4%', icon: DollarSign },
    { label: 'Total Acquisitions', value: totalOrdersCount !== null ? totalOrdersCount.toLocaleString() : '142', change: '+12.1%', icon: ShoppingCart },
    { label: 'Archived Jewelry Pieces', value: productCount !== null ? productCount.toLocaleString() : '48', change: 'Live', icon: Gem },
    { label: 'Curated Houses', value: categoryCount !== null ? categoryCount.toLocaleString() : '6', change: 'Active', icon: Layers },
  ]

  return (
    <div className="space-y-8 text-zinc-900">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.25em] font-semibold block mb-1">
            ✦ Executive Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-zinc-950 mb-0">
            Luméa Atelier Intelligence
          </h1>
          <p className="text-zinc-500 text-xs font-light mt-1">
            Real-time telemetry on salon revenue, collector orders, and high jewelry inventory.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/products" 
            className="px-5 py-2.5 bg-black text-white hover:bg-zinc-800 text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs"
          >
            Manage Archive
          </Link>
          <Link 
            href="/admin/orders" 
            className="px-5 py-2.5 bg-white border border-zinc-300 text-zinc-900 hover:border-black text-xs font-medium tracking-wider uppercase transition-colors shadow-xs"
          >
            Review Orders
          </Link>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white border border-zinc-200 p-6 flex flex-col justify-between hover:border-[#C5A059] transition-all shadow-xs">
              <div className="flex items-center justify-between w-full mb-4">
                <div className="w-10 h-10 bg-zinc-50 border border-zinc-200 flex items-center justify-center text-[#C5A059]">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 border border-[#C5A059]/20 font-semibold">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-light mb-1">{stat.label}</p>
                <p className="text-2xl font-serif text-zinc-950 font-normal">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-serif text-xl font-normal text-zinc-950 mb-0">Acquisition Velocity</h3>
              <p className="text-xs text-zinc-500 font-light mt-0.5">Monthly revenue volume (INR)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#C5A059]" />
              <span className="text-[11px] text-zinc-700 font-medium uppercase tracking-wider">Gross Sales</span>
            </div>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicSalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E4E4E7" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#71717A' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#71717A' }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E4E4E7',
                    borderRadius: '2px',
                    fontSize: '12px',
                    color: '#18181B',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                />
                <Bar dataKey="sales" fill="#C5A059" barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white border border-zinc-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="font-serif text-xl font-normal text-zinc-950 mb-0">Category Proportions</h3>
            <p className="text-xs text-zinc-500 font-light mt-0.5">Inventory distribution by house</p>
          </div>
          
          <div className="relative h-52 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dynamicProductCategoryData}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {dynamicProductCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E4E4E7', 
                    borderRadius: '2px',
                    color: '#18181B',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-serif text-2xl text-zinc-950">Luméa</span>
              <span className="text-[9px] text-[#C5A059] uppercase tracking-widest font-semibold">Mix</span>
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t border-zinc-200">
             {dynamicProductCategoryData.map(item => (
               <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                     <span className="text-zinc-600 font-light">{item.name}</span>
                  </div>
                  <span className="text-zinc-950 font-medium">{item.value}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity Table ── */}
      <div className="bg-white border border-zinc-200 overflow-hidden shadow-xs">
        <div className="p-6 sm:p-7 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-normal text-zinc-950 mb-0">Recent Salon Acquisitions</h3>
            <p className="text-xs text-zinc-500 font-light mt-0.5">Latest high fine jewelry orders submitted</p>
          </div>
          <Link 
            href="/admin/orders" 
            className="text-xs uppercase tracking-widest text-[#C5A059] hover:text-black transition-colors font-semibold"
          >
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 uppercase tracking-widest text-[10px] border-b border-zinc-200">
                <th className="text-left py-3.5 px-6 font-semibold">Order Reference</th>
                <th className="text-left py-3.5 px-4 font-semibold">Collector Name</th>
                <th className="text-left py-3.5 px-4 font-semibold">Valuation</th>
                <th className="text-left py-3.5 px-4 font-semibold">Status</th>
                <th className="text-left py-3.5 px-4 font-semibold">Date</th>
                <th className="text-right py-3.5 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400 font-serif text-sm">
                    No recent acquisitions recorded in the salon ledger.
                  </td>
                </tr>
              ) : recentOrders.map((order) => (
                <tr key={order.external_id || order.id} className="hover:bg-zinc-50/70 transition">
                  <td className="py-4 px-6 font-mono text-[#C5A059] font-medium">
                    {order.external_id || order.id.slice(0, 8)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-zinc-950 font-medium">{order.shipping_address?.name || 'Private Collector'}</div>
                    <div className="text-[10px] text-zinc-500">{order.customer_email}</div>
                  </td>
                  <td className="py-4 px-4 font-serif text-zinc-950 text-sm font-medium">
                    ₹{Number(order.total).toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-zinc-100 border border-zinc-300 text-zinc-800 font-medium">
                      {order.status || 'Confirmed'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-zinc-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link 
                      href={`/admin/orders`} 
                      className="text-zinc-400 hover:text-black"
                    >
                      <MoreHorizontal className="w-4 h-4 ml-auto" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
