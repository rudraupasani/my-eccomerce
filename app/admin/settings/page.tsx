'use client'

import { useState } from 'react'
import { Gem, ShieldCheck, Save, Check } from 'lucide-react'

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('Luméa High Fine Jewelry')
  const [adminEmail, setAdminEmail] = useState('salon@lumea-finejewelry.com')
  const [currency, setCurrency] = useState('INR (₹)')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 text-zinc-900 max-w-4xl">
      <div className="pb-5 border-b border-zinc-200">
        <span className="text-[#C5A059] text-xs uppercase tracking-[0.25em] font-semibold block mb-1">
          ✦ Configuration
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-normal text-zinc-950 mb-0">
          Salon & Atelier Settings
        </h1>
        <p className="text-zinc-500 text-xs font-light mt-1">
          Configure store identity, concierge notifications, and currencies.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-zinc-200 p-6 sm:p-7 space-y-5 shadow-xs">
          <h2 className="font-serif text-xl font-normal text-zinc-950 flex items-center gap-2 mb-0">
            <Gem className="w-5 h-5 text-[#C5A059]" />
            <span>Storefront Brand Identity</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-700 font-medium mb-1.5">
                Maison / Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-700 font-medium mb-1.5">
                Client Advisory Concierge Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-700 font-medium mb-1.5">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#C5A059]"
              >
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 p-6 sm:p-7 space-y-3 shadow-xs">
          <h2 className="font-serif text-xl font-normal text-zinc-950 flex items-center gap-2 mb-0">
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            <span>Security & Compliance</span>
          </h2>
          <p className="text-xs text-zinc-600 font-light leading-relaxed">
            Razorpay live gateway and Supabase database authorization tokens are configured via environment secrets. All customer transactions are end-to-end encrypted with TLS 1.3.
          </p>
        </div>

        <button
          type="submit"
          className="px-8 py-3 bg-black text-white hover:bg-zinc-800 text-xs font-semibold tracking-widest uppercase transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Preferences Saved' : 'Save Console Preferences'}</span>
        </button>
      </form>
    </div>
  )
}
