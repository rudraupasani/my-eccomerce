'use client'

import { AdminHeader } from '@/components/admin-header'
import { AdminSidebar } from '@/components/admin-sidebar'

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-serif font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">System settings and configuration</p>
          
          <div className="max-w-2xl">
            <div className="bg-card rounded-lg p-6 border border-border mb-6">
              <h2 className="text-lg font-serif font-semibold mb-4">Store Settings</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Store Name" className="w-full px-3 py-2 border border-border rounded" />
                <input type="email" placeholder="Admin Email" className="w-full px-3 py-2 border border-border rounded" />
                <textarea placeholder="Store Description" rows={4} className="w-full px-3 py-2 border border-border rounded" />
                <button className="px-6 py-2 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
