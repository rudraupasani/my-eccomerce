'use client'

import { Bell, Search } from 'lucide-react'

export function AdminHeader() {
  return (
    <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-2xs">

      {/* Search Input */}
      <div className="max-w-md w-full relative hidden md:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search collections, SKU, orders or collectors…"
          className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#C5A059] transition-colors"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">

        {/* Salon Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-50 border border-zinc-200 text-[10px] uppercase tracking-widest text-zinc-700 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Atelier Live</span>
        </div>

        <button
          aria-label="Notifications"
          className="relative p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 transition rounded-xs"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
        </button>

        <div className="h-6 w-px bg-zinc-200 mx-1" />

        {/* Profile Pill */}
        <div className="flex items-center gap-3 p-1.5 hover:bg-zinc-50 transition group cursor-pointer">
          <div className="w-8 h-8 border border-[#C5A059] bg-[#C5A059]/10 rounded-full flex items-center justify-center text-[#C5A059] text-xs font-serif font-bold">
            LA
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-zinc-900 leading-tight">Salon Director</div>
            <div className="text-[10px] text-zinc-500 font-light leading-tight">Master Console</div>
          </div>
        </div>
      </div>
    </header>
  )
}
