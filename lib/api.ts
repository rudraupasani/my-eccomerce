import { supabase } from './supabase'
import { Product, Category } from './types'

// Categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data as Category[]
}

export async function createCategory(category: { name: string; image_url?: string }) {
  const slug = category.name.toLowerCase().replace(/\s+/g, '-')
  const insertData: any = { name: category.name, slug }
  if (category.image_url) insertData.image_url = category.image_url
  
  const { data, error } = await supabase
    .from('categories')
    .insert([insertData])
    .select()
  
  if (error) throw error
  return data[0] as Category
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function updateCategory(id: string, updates: Partial<{ name: string; image_url: string }>) {
  const dbUpdates: any = {}
  if (updates.name) dbUpdates.name = updates.name
  if (updates.image_url) dbUpdates.image_url = updates.image_url
  
  const { data, error } = await supabase
    .from('categories')
    .update(dbUpdates)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0] as Category
}

// Products
export async function getProducts(options?: { categoryId?: string; inStock?: boolean }) {
  let query = supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })
  
  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }
  
  if (options?.inStock !== undefined) {
    query = query.eq('in_stock', options.inStock)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as any[] 
}

export async function createProduct(product: any) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function updateProduct(id: string, updates: any) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Storage
export async function uploadProductImage(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(filePath)

  return publicUrl
}

// helper for category images (uses products bucket with categories folder)
export async function uploadCategoryImage(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `categories/${fileName}`

  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(filePath)

  return publicUrl
}

// Wishlist
export async function getWishlist(email: string) {
  const { data, error } = await supabase
    .from('wishlists')
    .select('*, products(*, categories(name))')
    .eq('email', email)
  
  if (error) throw error
  return data
}

export async function addToWishlist(email: string, productId: string) {
  const { data, error } = await supabase
    .from('wishlists')
    .insert([{ email, product_id: productId }])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function removeFromWishlist(email: string, productId: string) {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('email', email)
    .eq('product_id', productId)
  
  if (error) throw error
}

// Orders
export async function createOrder(orderData: any, items: any[]) {
  // 1. Create the Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
  
  if (orderError) throw orderError
  
  const orderId = order[0].id

  // 2. Create Order Items
  const orderItemsData = items.map(item => ({
    order_id: orderId,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) throw itemsError

  return order[0]
}

export async function getOrders(email?: string) {
  let query = supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .order('created_at', { ascending: false })

  if (email) {
    query = query.ilike('customer_email', email)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('external_id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Cart
export async function getCart(email: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*, categories(name))')
    .eq('email', email)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export async function addToCart(email: string, productId: string, quantity: number, price: number) {
  const { data, error } = await supabase
    .from('cart_items')
    .insert([{ email, product_id: productId, quantity, price }])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function updateCartQuantity(id: string, quantity: number) {
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function removeFromCart(id: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function clearCart(email: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('email', email)
  
  if (error) throw error
}
