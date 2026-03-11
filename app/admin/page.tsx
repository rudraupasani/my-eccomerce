'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getOrders } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Package, ShoppingCart, DollarSign, Users, ArrowUpRight, ArrowDownRight, MoreHorizontal, Calendar } from 'lucide-react'
import { ScrollAnimate } from '@/components/scroll-animate'
import Link from 'next/link'

const salesData = [
  { month: 'Jan', sales: 4000, orders: 24 },
  { month: 'Feb', sales: 3000, orders: 13 },
  { month: 'Mar', sales: 2000, orders: 9 },
  { month: 'Apr', sales: 2780, orders: 39 },
  { month: 'May', sales: 1890, orders: 28 },
  { month: 'Jun', sales: 2390, orders: 40 },
  { month: 'Jul', sales: 3490, orders: 45 },
]

const productCategoryData = [
  { name: 'Rings', value: 35, color: '#D4A017' }, // Accent color
  { name: 'Necklaces', value: 25, color: '#1A1A1A' }, // Foreground
  { name: 'Earrings', value: 20, color: '#666666' }, // Muted
  { name: 'Bracelets', value: 20, color: '#A3A3A3' }, // Muted light
]

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
          if (!acc[key]) acc[key] = { month: `${month} ${year}`, sales: 0, orders: 0 };
          acc[key].sales += Number(order.total);
          acc[key].orders += 1;
          return acc;
        }, {});
        const sortedSalesData = Object.values(salesByMonth || {}).sort((a: any, b: any) => {
          const dateA = new Date(a.month);
          const dateB = new Date(b.month);
          return dateA.getTime() - dateB.getTime();
        });
        setDynamicSalesData(sortedSalesData.length > 0 ? sortedSalesData : [{ month: 'No Data', sales: 0, orders: 0 }]);

        // Calculate dynamic product category data
        const productCategoryCounts: { [key: string]: number } = {};
        products?.forEach((product: any) => {
          const categoryName = product.categories?.name || 'Uncategorized';
          productCategoryCounts[categoryName] = (productCategoryCounts[categoryName] || 0) + 1;
        });

        const totalProducts = products?.length || 0;
        const categoryData = Object.entries(productCategoryCounts).map(([name, count]) => ({
          name,
          value: totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0,
          color: '#D4A017' // Default color, could assign dynamically or from a map
        }));
        // Assign specific colors for common categories, or cycle through a palette
        const colors = ['#D4A017', '#1A1A1A', '#666666', '#A3A3A3', '#B0C4DE', '#ADD8E6'];
        const finalCategoryData = categoryData.map((item, index) => ({
          ...item,
          color: colors[index % colors.length] // Cycle through predefined colors
        }));
        setDynamicProductCategoryData(finalCategoryData.length > 0 ? finalCategoryData : [{ name: 'No Categories', value: 100, color: '#A3A3A3' }]);

      } catch (err) {
        console.error("Failed to load dashboard stats", err)
      }
    }
    loadStats()
  }, [])

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: 'Live', icon: DollarSign, positive: true },
    { label: 'Total Orders', value: totalOrdersCount !== null ? totalOrdersCount.toLocaleString() : '0', change: 'Live', icon: ShoppingCart, positive: true },
    { label: 'Total Products', value: productCount !== null ? productCount.toLocaleString() : '0', change: 'Live', icon: Package, positive: true },
    { label: 'Categories', value: categoryCount !== null ? categoryCount.toLocaleString() : '0', change: 'Live', icon: Users },
  ]

  // Dynamic Category Data
  const categoriesMap = (recentOrders.length > 0 ? recentOrders : []).reduce((acc: any, order: any) => {
     order.order_items?.forEach((item: any) => {
        const catName = item.products?.categories?.name || 'Uncategorized'
        acc[catName] = (acc[catName] || 0) + Number(item.price * item.quantity)
     })
     return acc
  }, {})

  const colors = ['#D4A017', '#1A1A1A', '#666666', '#A3A3A3', '#E5E5E5']
  const productCategoryData = Object.entries(categoriesMap).length > 0
    ? Object.entries(categoriesMap).map(([name, value], i) => ({
        name,
        value: Math.round((Number(value) / totalRevenue) * 100),
        color: colors[i % colors.length]
      }))
    : [{ name: 'No Sales', value: 100, color: '#F5F5F5' }]

  return (
    <div className="space-y-10">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <ScrollAnimate type="fade-down">
          <h1 className="text-3xl font-bold mb-2 uppercase italic tracking-tighter">Command Center</h1>
          <p className="text-muted-foreground flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            Luxora Intelligence Suite
            <span className="w-1 h-1 bg-border rounded-full" />
            <span className="text-accent">LIVE REPOSITORY</span>
          </p>
        </ScrollAnimate>
        <div className="flex items-center gap-3">
          <Link href="/admin/analytics" className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Vew Detailed Analytics
          </Link>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          const delays = [0, 100, 200, 300] as const
          return (
            <ScrollAnimate key={stat.label} type="scale-up" delay={delays[i] ?? 0}>
              <div className="card-hover p-6 flex flex-col items-start h-full">
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-accent">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 uppercase tracking-widest">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-foreground">{stat.value}</p>
              </div>
            </ScrollAnimate>
          )
        })}
      </div>

      {/* ── Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Chart */}
        <ScrollAnimate type="fade-left" className="lg:col-span-2">
          <div className="card p-8 h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold">Sales & Orders Trend</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                   <span className="w-3 h-3 rounded-full bg-accent" />
                   <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Gross Sales</span>
                 </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={dynamicSalesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="sales" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollAnimate>

        {/* Category Share */}
        <ScrollAnimate type="fade-right" delay={150}>
          <div className="card p-8 h-full">
            <h3 className="text-lg font-bold mb-2">Revenue Share</h3>
            <p className="text-xs text-muted-foreground mb-8">Split by product category</p>
            <div className="relative h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productCategoryData}
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {productCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ border: 'none', borderRadius: '8px', background: 'hsl(var(--card))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black leading-none">{totalRevenue > 0 ? '100%' : '0%'}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1 text-center">Collection Mix</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
               {productCategoryData.map(item => (
                 <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{item.value}%</span>
                 </div>
               ))}
            </div>
          </div>
        </ScrollAnimate>
      </div>

      {/* ── Recent Activity Table ── */}
      <ScrollAnimate type="fade-up">
        <div className="card overflow-hidden">
          <div className="p-8 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Live Inventory Stream</h3>
              <p className="text-xs text-muted-foreground mt-1">Status of your most recent transactions</p>
            </div>
            <Link href="/admin/orders" className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-2">
              All Orders <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/30 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                  <th className="text-left py-4 px-8">Order ID</th>
                  <th className="text-left py-4 px-4">Customer Details</th>
                  <th className="text-left py-4 px-4">Amount</th>
                  <th className="text-left py-4 px-4">Status</th>
                  <th className="text-left py-4 px-4">Date Added</th>
                  <th className="text-right py-4 px-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground uppercase font-black tracking-widest text-[10px]">No orders recorded</td>
                  </tr>
                ) : recentOrders.map((order, i) => (
                  <tr key={order.external_id} className="hover:bg-secondary/20 transition group">
                    <td className="py-5 px-8 font-black text-accent tracking-tighter uppercase">{order.external_id}</td>
                    <td className="py-5 px-4">
                      <div className="font-bold text-foreground">{order.shipping_address?.name || 'Valued Guest'}</div>
                      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{order.customer_email}</div>
                    </td>
                    <td className="py-5 px-4 font-black">${order.total.toLocaleString()}</td>
                    <td className="py-5 px-4">
                      <span className={`badge py-1 px-3 ${
                        order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-muted-foreground font-medium">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-5 px-8 text-right">
                       <Link href={`/admin/orders/${order.id}`} className="p-2 hover:bg-secondary rounded-lg transition text-muted-foreground hover:text-foreground inline-block">
                          <MoreHorizontal className="w-5 h-5" />
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollAnimate>

    </div>
  )
}
