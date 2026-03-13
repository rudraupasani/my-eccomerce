'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { ScrollAnimate } from '@/components/scroll-animate'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/'), 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 pt-16">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl text-accent font-bold">✦</span>
            <span className="text-2xl font-bold tracking-widest">LUXORA</span>
          </Link>
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-muted-foreground text-sm">Join Luxora for an exclusive experience</p>
        </div>

        {/* Card */}
        <ScrollAnimate type="scale-up">
          <div className="card p-8">
          {success ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Account created!</h3>
              <p className="text-muted-foreground text-sm">
                Check your email to confirm your account. Redirecting to home…
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded px-4 py-3 mb-6 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Jane Smith"
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      className="input-field pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Creating account…' : 'Create account'}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  By creating an account you agree to our{' '}
                  <a href="#" className="text-accent hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
                </p>
              </form>
            </>
          )}
        </div>
        </ScrollAnimate>

        <p className="text-center text-sm text-muted-foreground mb-10">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
