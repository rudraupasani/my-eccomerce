'use client'

import { useState, useEffect } from 'react'
import { getOrders } from '@/lib/api'
import { ScrollAnimate } from '@/components/scroll-animate'
import { Users, Mail, DollarSign, Calendar, ChevronRight, Loader2, Search } from 'lucide-react'

export default function AdminUsersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true)
        const orders = await getOrders()
        
        // Extract unique customers from orders
        const customerMap = orders.reduce((acc: any, order: any) => {
          const email = order.customer_email
          if (!acc[email]) {
            acc[email] = {
              name: order.shipping_address?.name || 'Valued Guest',
              email: email,
              totalSpent: 0,
              orderCount: 0,
              lastOrder: order.created_at
            }
          }
          acc[email].totalSpent += Number(order.total)
          acc[email].orderCount += 1
          if (new Date(order.created_at) > new Date(acc[email].lastOrder)) {
            acc[email].lastOrder = order.created_at
          }
          return acc
        }, {})

        setCustomers(Object.values(customerMap))
      } catch (err) {
        console.error("Failed to fetch customers:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-10">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <ScrollAnimate type="fade-down">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
             <span>Admin</span>
             <ChevronRight className="w-3 h-3" />
             <span className="text-accent">Customers</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Customer Relations</h1>
          <p className="text-muted-foreground">Manage and review your luxury client base</p>
        </ScrollAnimate>
      </div>

      {/* ── Search Bar ── */}
      <ScrollAnimate type="fade-up">
        <div className="bg-card border border-border p-4 rounded-xl flex items-center shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Client Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent transition"
            />
          </div>
        </div>
      </ScrollAnimate>

      {/* ── Customers Table ── */}
      <ScrollAnimate type="fade-up" delay={100}>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/30 text-muted-foreground text-[10px] uppercase font-bold tracking-widest border-b border-border">
                  <th className="text-left py-4 px-8">Client Name</th>
                  <th className="text-left py-4 px-4">Direct Contact</th>
                  <th className="text-left py-4 px-4">LTV (Lifetime Value)</th>
                  <th className="text-left py-4 px-4">Total Orders</th>
                  <th className="text-left py-4 px-4">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Synchronizing Client Records...</span>
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                      No customer records found
                    </td>
                  </tr>
                ) : filteredCustomers.map((user) => (
                  <tr key={user.email} className="hover:bg-secondary/20 transition group">
                    <td className="py-5 px-8 font-bold text-foreground">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black text-accent uppercase">
                             {user.name.charAt(0)}
                          </div>
                          {user.name}
                       </div>
                    </td>
                    <td className="py-5 px-4 text-muted-foreground font-medium flex items-center gap-2">
                       <Mail className="w-3 h-3" />
                       {user.email}
                    </td>
                    <td className="py-5 px-4 font-black text-foreground">
                       <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-emerald-500" />
                          {user.totalSpent.toLocaleString()}
                       </div>
                    </td>
                    <td className="py-5 px-4 font-bold text-muted-foreground">{user.orderCount} Orders</td>
                    <td className="py-5 px-4 text-muted-foreground font-medium flex items-center gap-2">
                       <Calendar className="w-3 h-3" />
                       {new Date(user.lastOrder).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-border bg-secondary/10 flex justify-between items-center">
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Database currently tracking {customers.length} unique client profiles
             </p>
          </div>
        </div>
      </ScrollAnimate>
    </div>
  )
}
