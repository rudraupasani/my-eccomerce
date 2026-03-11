'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth-context'
import { getWishlist, addToWishlist, removeFromWishlist } from '@/lib/api'

interface WishlistContextType {
  wishlist: string[]
  toggleWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { user, session } = useAuth()

  // Use email or a temporary anonymous ID for the wishlist
  const wishlistIdentifier = user?.email || 'anonymous-session'

  useEffect(() => {
    async function fetchWishlist() {
      if (!wishlistIdentifier) return
      setLoading(true)
      try {
        const data = await getWishlist(wishlistIdentifier)
        if (data) {
          setWishlist(data.map((item: any) => item.product_id))
        }
      } catch (error) {
        console.error('Failed to load wishlist', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchWishlist()
  }, [wishlistIdentifier])

  const toggleWishlist = async (productId: string) => {
    if (!wishlistIdentifier) return

    try {
      const isCurrentlyInWishlist = wishlist.includes(productId)
      
      // Optimistic Update
      setWishlist((prev) => 
        isCurrentlyInWishlist 
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      )

      if (isCurrentlyInWishlist) {
        await removeFromWishlist(wishlistIdentifier, productId)
      } else {
        await addToWishlist(wishlistIdentifier, productId)
      }
      
    } catch (error) {
      console.error('Failed to toggle wishlist', error)
      // Revert on failure
      const data = await getWishlist(wishlistIdentifier)
      if (data) {
         setWishlist(data.map((item: any) => item.product_id))
      }
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId)
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
