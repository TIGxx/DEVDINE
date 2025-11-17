"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CartStore } from "@/lib/cart-store"
import type { CartItem } from "@/lib/types"

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const updateCart = () => {
      setCartItems(CartStore.getCart())
      setTotal(CartStore.getTotal())
    }

    updateCart()
    window.addEventListener("cart-updated", updateCart)

    return () => {
      window.removeEventListener("cart-updated", updateCart)
    }
  }, [])

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    CartStore.updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = (itemId: string) => {
    CartStore.removeItem(itemId)
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* Header */}
      <header className="bg-[#FFF8E7] border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-IVXQ4JWg3zR7d7S15IXHAR5pXgOXre.png"
              alt="DEVDINE Logo"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <button onClick={() => router.push("/menu")} className="text-gray-700 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <main className="px-4 py-6 pb-32">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <button
              onClick={() => router.push("/menu")}
              className="bg-[#C41E3A] hover:bg-[#A01828] text-white font-bold px-8 py-3 rounded-full transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className="w-16 h-16 bg-[#E57373] rounded-full flex-shrink-0 overflow-hidden">
                  <img
                    src={`/.jpg?height=64&width=64&query=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.price} B</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700"
                  >
                    +
                  </button>
                </div>
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-600 hover:text-red-800 ml-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-[#C41E3A]">{total.toFixed(2)} B</span>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-[#C41E3A] hover:bg-[#A01828] text-white font-bold py-3 rounded-full transition-colors shadow-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  )
}
