'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/auth-context'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { ScrollAnimate } from '@/components/scroll-animate'
import { Suspense } from 'react'

function LoginContent() {
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      const redirect = searchParams.get('redirect') || '/'
      router.push(redirect)
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-white px-4 py-8 text-zinc-900">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-2">
            <span className="font-serif text-3xl tracking-[0.2em] text-zinc-950">Luméa</span>
          </Link>
          <h1 className="text-xl font-serif font-normal text-zinc-950 mb-0">Salon Sign In</h1>
          <p className="text-zinc-500 text-xs font-light mt-1">Access your private collection & order archive</p>
        </div>

        {/* Card */}
        <ScrollAnimate type="scale-up">
          <div className="bg-white border border-zinc-200 p-8 shadow-sm">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-700 font-medium mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="collector@lumea.com"
                  required
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs uppercase tracking-wider text-zinc-700 font-medium">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 text-xs focus:outline-none focus:border-[#C5A059] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white hover:bg-zinc-800 text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer mt-5 shadow-xs"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In To Account'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-zinc-200 text-center text-xs text-zinc-600">
              Don't have a Luméa account?{' '}
              <Link href="/register" className="text-[#C5A059] hover:underline font-medium">
                Create one
              </Link>
            </div>
          </div>
        </ScrollAnimate>

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
