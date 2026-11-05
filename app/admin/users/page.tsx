'use client'

import { useState, useEffect } from 'react'
import { getOrders } from '@/lib/api'
import { Loader2, Search } from 'lucide-react'

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
          const email = order.customer_email || 'salon.client@lumea.com'
          if (!acc[email]) {
            acc[email] = {
              name: order.shipping_address?.name || 'Private Collector',
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
    <div className="space-y-6 text-zinc-900">
      {/* ── Page Header ── */}
      <div className="pb-5 border-b border-zinc-200">
        <span className="text-[#C5A059] text-xs uppercase tracking-[0.25em] font-semibold block mb-1">
          ✦ Client Registry
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-normal text-zinc-950 mb-0">
          Collectors & House Clients
        </h1>
        <p className="text-zinc-500 text-xs font-light mt-1">
          Manage and review registered salon collectors and cumulative private acquisitions.
        </p>
      </div>

      {/* ── Search Bar ── */}
      <div className="bg-white border border-zinc-200 p-3 sm:p-4 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by client name or email address…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* ── Customers Table ── */}
      <div className="bg-white border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 uppercase tracking-widest text-[10px] border-b border-zinc-200">
                <th className="text-left py-3.5 px-6 font-semibold">Collector</th>
                <th className="text-left py-3.5 px-4 font-semibold">Email</th>
                <th className="text-left py-3.5 px-4 font-semibold">Cumulative LTV</th>
                <th className="text-left py-3.5 px-4 font-semibold">Acquisitions</th>
                <th className="text-left py-3.5 px-6 font-semibold">Last Interaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C5A059]" />
                    <span className="text-xs text-zinc-500">Retrieving collector archives…</span>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-zinc-400 font-serif">
                    No matching client records found.
                  </td>
                </tr>
              ) : filteredCustomers.map((user) => (
                <tr key={user.email} className="hover:bg-zinc-50/70 transition">
                  <td className="py-4 px-6 text-zinc-950 font-medium">
                     <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-zinc-100 border border-zinc-300 flex items-center justify-center text-[10px] text-[#C5A059] font-serif font-bold">
                           {user.name.charAt(0)}
                        </div>
                        <span>{user.name}</span>
                     </div>
                  </td>
                  <td className="py-4 px-4 text-zinc-600 font-light">
                     {user.email}
                  </td>
                  <td className="py-4 px-4 font-serif text-zinc-950 text-sm font-medium">
                     ₹{user.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-zinc-700">
                    {user.orderCount} {user.orderCount === 1 ? 'piece' : 'pieces'}
                  </td>
                  <td className="py-4 px-6 text-zinc-500">
                     {new Date(user.lastOrder).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-zinc-200 bg-zinc-50/50 flex justify-between items-center text-[11px] text-zinc-500">
           <span>Total Client Ledger: {customers.length} registered profiles</span>
        </div>
      </div>
    </div>
  )
}
