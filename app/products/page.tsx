import ProductsClient from './products-client'
import { Suspense } from 'react'

export default function ProductsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  let categoryFilter = 'All'
  if (typeof searchParams?.category === 'string') {
    try {
      categoryFilter = decodeURIComponent(searchParams.category).trim()
    } catch (e) {
      categoryFilter = searchParams.category.trim()
    }
  }
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
      </div>
    }>
      <ProductsClient categoryFilter={categoryFilter} />
    </Suspense>
  )
}
