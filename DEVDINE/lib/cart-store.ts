"use client"

import type { CartItem, MenuItem } from "./types"

export class CartStore {
  private static STORAGE_KEY = "devdine_cart"

  static getCart(): CartItem[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static addItem(item: MenuItem): void {
    const cart = this.getCart()
    const existingIndex = cart.findIndex((i) => i.id === item.id)

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1
    } else {
      cart.push({ ...item, quantity: 1 })
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart))
    window.dispatchEvent(new Event("cart-updated"))
  }

  static removeItem(itemId: string): void {
    const cart = this.getCart()
    const filtered = cart.filter((i) => i.id !== itemId)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
    window.dispatchEvent(new Event("cart-updated"))
  }

  static updateQuantity(itemId: string, quantity: number): void {
    const cart = this.getCart()
    const item = cart.find((i) => i.id === itemId)

    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId)
      } else {
        item.quantity = quantity
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart))
        window.dispatchEvent(new Event("cart-updated"))
      }
    }
  }

  static clearCart(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    window.dispatchEvent(new Event("cart-updated"))
  }

  static getTotal(): number {
    const cart = this.getCart()
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  static getItemCount(): number {
    const cart = this.getCart()
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }
}
