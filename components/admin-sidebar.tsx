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
  Gem,
  Layers
} from 'lucide-react'
import { useState } from 'react'

interface AdminSidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export function AdminSidebar({ collapsed, setCollapsed }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/categories', icon: Layers, label: 'Categories' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/users', icon: Users, label: 'Customers' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside 
      className={`fixed left-0 top-0 z-50 h-screen bg-card/90 border-r border-border transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-border mb-4">
        <div className="w-8 h-8 rounded bg-accent flex items-center justify-center flex-shrink-0 text-white shadow-sm">
          <Gem className="w-5 h-5" />
        </div>
        {!collapsed && (
          <span className="font-bold tracking-widest text-lg">LUXORA <span className="text-accent text-[10px]">CMS</span></span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pt-4">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href) && item.href !== '/admin'
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
                isActive
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-accent transition-colors'}`} />
              {!collapsed && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-4 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors group">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-bold tracking-tight">Log Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-7 -right-3.5 w-7 h-7 bg-accent text-white border border-white/30 rounded-full flex items-center justify-center shadow-sm hover:bg-accent/90 transition-colors z-10"
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  )
}
