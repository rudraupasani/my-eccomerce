export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_id?: string
  category?: string
  rating: number
  reviews: number
  in_stock: boolean
  sku: string
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: string
  estimatedDelivery: string
  customerEmail: string
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export interface Review {
  id: string
  productId: string
  rating: number
  title: string
  comment: string
  author: string
  date: string
}

export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface User {
  id: string
  email: string
  name: string
  orders: Order[]
}
