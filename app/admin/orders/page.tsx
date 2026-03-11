'use client'

import { getOrders, updateOrderStatus } from '@/lib/api'
import { useEffect, useState } from 'react'
import { ScrollAnimate } from '@/components/scroll-animate'
import { Loader2, ChevronRight, Download, Search, Filter, Eye, MoreHorizontal, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminOrdersPage() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrdersAction = async () => {
    try {
      setLoading(true)
      const data = await getOrders()
      setOrders(data || [])
    } catch (err) {
      console.error("Failed to fetch admin orders:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrdersAction()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId)
      await updateOrderStatus(orderId, newStatus)
      // Update local state to reflect change immediately
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } catch (err) {
      console.error("Failed to update status:", err)
      alert("Failed to update order status.")
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status.toLowerCase() === filterStatus.toLowerCase())

  // Calculate Dynamic Stats
  const pendingCount = orders.filter(o => ['Pending', 'Processing'].includes(o.status)).length
  const shippedCount = orders.filter(o => o.status === 'Shipped').length
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length
  const alertCount = orders.filter(o => o.status === 'Alert').length

  const statsList = [
    { label: 'Pending Fulfillment', value: pendingCount.toString(), color: 'text-amber-500' },
    { label: 'Recently Shipped', value: shippedCount.toString(), color: 'text-blue-500' },
    { label: 'Total Delivered', value: deliveredCount.toString(), color: 'text-emerald-500' },
    { label: 'Returns Flagged', value: alertCount.toString(), color: 'text-destructive' },
  ]

  return (
    <div className="space-y-10">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <ScrollAnimate type="fade-down">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
             <span>Admin</span>
             <ChevronRight className="w-3 h-3" />
             <span className="text-accent">Orders</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-muted-foreground">Track, fulfill, and manage all luxury transactions</p>
        </ScrollAnimate>
        <div className="flex items-center gap-3">
          <button className="btn-secondary py-2 text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="btn-primary py-2 text-sm">Create Manual Order</button>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsList.map((stat, i) => (
          <ScrollAnimate key={stat.label} type="scale-up" delay={([0, 100, 200, 300] as const)[i] ?? 0}>
             <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
             </div>
          </ScrollAnimate>
        ))}
      </div>

      {/* ── Filter & Search Bar ── */}
      <ScrollAnimate type="fade-up">
        <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            < Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name or Email..."
              className="w-full pl-12 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent transition"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <Filter className="w-4 h-4 text-muted-foreground hidden md:block" />
             <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 md:w-48 appearance-none px-4 py-2.5 border border-border rounded-lg bg-background text-sm font-bold focus:outline-none focus:ring-1 focus:ring-accent transition"
              >
                <option value="all">All Order Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
          </div>
        </div>
      </ScrollAnimate>

      {/* ── Orders Table ── */}
      <ScrollAnimate type="fade-up" delay={100}>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/30 text-muted-foreground text-[10px] uppercase font-bold tracking-widest border-b border-border">
                  <th className="text-left py-4 px-8">Order ID</th>
                  <th className="text-left py-4 px-4">Customer Details</th>
                  <th className="text-left py-4 px-4">Cart Size</th>
                  <th className="text-left py-4 px-4">Price Total</th>
                  <th className="text-left py-4 px-4">Status & Action</th>
                  <th className="text-left py-4 px-4">Date Added</th>
                  <th className="text-right py-4 px-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                      <span className="text-xs font-bold uppercase tracking-widest">Retrieving Transactions...</span>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                       <span className="text-xs font-bold uppercase tracking-widest">No matching orders found</span>
                    </td>
                  </tr>
                ) : filteredOrders.map((order, i) => (
                  <tr key={order.id} className="hover:bg-secondary/20 transition group">
                    <td className="py-5 px-8 font-black text-accent tracking-tighter uppercase">{order.external_id}</td>
                    <td className="py-5 px-4">
                      <div className="font-bold text-foreground">{order.shipping_address?.name || 'Valued Guest'}</div>
                      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{order.customer_email}</div>
                    </td>
                    <td className="py-5 px-4 font-medium text-muted-foreground">{order.order_items?.length || 0} Items</td>
                    <td className="py-5 px-4 font-black">${order.total.toLocaleString()}</td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col gap-2">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border-2 appearance-none cursor-pointer focus:outline-none transition ${
                            order.status === 'Delivered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                            order.status === 'Shipped' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                            order.status === 'Processing' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                            'bg-purple-500/10 border-purple-500/20 text-purple-500'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Alert">Alert</option>
                        </select>
                        {updatingId === order.id && (
                          <span className="text-[8px] font-bold text-accent animate-pulse">Syncing...</span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-4 text-muted-foreground font-medium">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-5 px-8 text-right">
                       <div className="flex items-center justify-end gap-2 text-muted-foreground">
                          <Link href={`/admin/orders/${order.id}`} className="p-2 hover:bg-secondary hover:text-accent rounded-lg transition">
                             <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-2 hover:bg-secondary rounded-lg transition">
                             <MoreHorizontal className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Placeholder */}
          <div className="p-6 border-t border-border flex items-center justify-between bg-secondary/10">
             <p className="text-xs text-muted-foreground font-medium">Showing 1 to {filteredOrders.length} of {orders.length} entries</p>
             <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-border rounded bg-card text-xs font-bold hover:bg-secondary transition disabled:opacity-50">Prev</button>
                <button className="px-3 py-1.5 border border-border rounded bg-accent text-white text-xs font-bold shadow-lg shadow-accent/20">1</button>
                <button className="px-3 py-1.5 border border-border rounded bg-card text-xs font-bold hover:bg-secondary transition">Next</button>
             </div>
          </div>
        </div>
      </ScrollAnimate>

    </div>
  )
}
