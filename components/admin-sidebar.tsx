'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  LayoutDashboard,
  Layers,
  ExternalLink
} from 'lucide-react'

interface AdminSidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export function AdminSidebar({ collapsed, setCollapsed }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
    { href: '/admin/products', icon: Package, label: 'Jewelry Archive' },
    { href: '/admin/categories', icon: Layers, label: 'Houses & Collections' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders & Acquisitions' },
    { href: '/admin/users', icon: Users, label: 'Clients & Collectors' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Salon Analytics' },
    { href: '/admin/settings', icon: Settings, label: 'Console Settings' },
  ]

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen bg-white border-r border-zinc-200 transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-72'
        }`}
    >
      {/* Brand & Monogram */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-zinc-200 shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-black flex items-center justify-center shrink-0 text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-black transition-colors">
            <span className="font-serif text-lg leading-none">L</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-[0.18em] text-zinc-950 leading-tight">Luméa</span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">Atelier Console</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-5">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== '/admin'

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 text-xs tracking-wider transition-all rounded-xs ${isActive
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
                }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C5A059]' : 'text-zinc-500'}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Return to Storefront & Logout */}
      <div className="p-4 border-t border-zinc-200 space-y-1 bg-zinc-50/50">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-xs text-zinc-600 hover:text-black hover:bg-white rounded-xs transition-colors"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-[#C5A059]" />
          {!collapsed && <span className="font-medium">Return To Store</span>}
        </Link>

        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xs transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Exit Console</span>}
        </Link>
      </div>

      {/* Collapse Toggle Pill */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-7 -right-3.5 w-7 h-7 bg-white text-zinc-700 border border-zinc-300 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors z-20 cursor-pointer shadow-sm"
      >
        <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  )
}
