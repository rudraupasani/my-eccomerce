import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <div className="text-9xl font-serif font-bold text-accent mb-4">404</div>
            <h1 className="mb-4">Page Not Found</h1>
            <p className="text-muted-foreground text-lg mb-8">
              We couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-accent text-accent-foreground font-serif font-semibold rounded hover:bg-accent/90 transition inline-flex items-center justify-center gap-2"
            >
              Return Home
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/products"
              className="px-8 py-3 border border-border text-foreground font-serif font-semibold rounded hover:bg-secondary transition inline-flex items-center justify-center"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
