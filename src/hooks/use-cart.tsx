"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { CartItem, Product } from "@/lib/types"

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Could not load cart from local storage", error);
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Could not save cart to local storage", error);
    }
  }, [items])

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevItems, { product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
