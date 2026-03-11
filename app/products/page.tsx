import ProductsClient from './products-client'

export default function ProductsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const categoryFilter = typeof searchParams?.category === 'string' ? searchParams.category : 'All'
  return <ProductsClient categoryFilter={categoryFilter} />
}
