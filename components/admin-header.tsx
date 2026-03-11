'use client'

import { Bell, Search, User, ChevronDown } from 'lucide-react'

export function AdminHeader() {
  return (
    <header className="h-20 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">
      
      {/* Search Input */}
      <div className="max-w-md w-full relative hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Quick search dashboard…" 
          className="w-full pl-12 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        <button className="relative p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
        </button>

        <div className="h-8 w-px bg-border mx-2" />

        <button className="flex items-center gap-3 p-1.5 pr-3 hover:bg-secondary rounded-lg transition group">
          <div className="w-9 h-9 border border-border bg-background rounded-full flex items-center justify-center overflow-hidden">
            <User className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-none mb-1">Admin Account</div>
            <div className="text-[10px] text-muted-foreground leading-none font-medium">Main Dashboard</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </header>
  )
}
