'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { CartItem } from '@/lib/types'
import { useAuth } from './auth-context'
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart as clearCartApi } from '@/lib/api'

interface CartContextType {
  items: CartItem[]
  addItem: (productId: string, price: number, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage or Supabase on mount/auth change
  useEffect(() => {
    setMounted(true)
    
    async function loadCart() {
      if (user?.email) {
        try {
          const dbItems = await getCart(user.email)
          const formattedItems: CartItem[] = dbItems.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            quantity: item.quantity,
            price: Number(item.price)
          }))
          setItems(formattedItems)
        } catch (e) {
          console.error('Failed to fetch cart from Supabase:', e)
        }
      } else {
        const saved = localStorage.getItem('cart-items')
        if (saved) {
          try {
            setItems(JSON.parse(saved))
          } catch (e) {
            console.error('Failed to parse cart from localStorage:', e)
          }
        }
      }
    }
    
    loadCart()
  }, [user])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart-items', JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = async (productId: string, price: number, quantity: number) => {
    if (user?.email) {
      try {
        const existingItem = items.find(item => item.productId === productId)
        if (existingItem) {
          const newQty = existingItem.quantity + quantity
          await updateCartQuantity(existingItem.id, newQty)
          setItems(prevItems => prevItems.map(item =>
            item.productId === productId ? { ...item, quantity: newQty } : item
          ))
        } else {
          const newItem = await addToCart(user.email, productId, quantity, price)
          setItems(prevItems => [...prevItems, {
            id: newItem.id,
            productId: newItem.product_id,
            quantity: newItem.quantity,
            price: Number(newItem.price)
          }])
        }
      } catch (e) {
        console.error('Failed to add to cart in Supabase:', e)
      }
    } else {
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.productId === productId)
        if (existingItem) {
          return prevItems.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        return [...prevItems, { id: `${productId}-${Date.now()}`, productId, quantity, price }]
      })
    }
  }

  const removeItem = async (productId: string) => {
    const itemToRemove = items.find(item => item.productId === productId)
    if (user?.email && itemToRemove) {
      try {
        await removeFromCart(itemToRemove.id)
      } catch (e) {
        console.error('Failed to remove from cart in Supabase:', e)
      }
    }
    setItems(prevItems => prevItems.filter(item => item.productId !== productId))
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    if (user?.email) {
      const itemToUpdate = items.find(item => item.productId === productId)
      if (itemToUpdate) {
        try {
          await updateCartQuantity(itemToUpdate.id, quantity)
        } catch (e) {
          console.error('Failed to update cart quantity in Supabase:', e)
        }
      }
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = async () => {
    if (user?.email) {
      try {
        await clearCartApi(user.email)
      } catch (e) {
        console.error('Failed to clear cart in Supabase:', e)
      }
    }
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
