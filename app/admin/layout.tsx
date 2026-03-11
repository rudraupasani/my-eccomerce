'use client'

import React from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { AdminHeader } from '@/components/admin-header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Spacer to push content when sidebar is fixed */}
      <div className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
