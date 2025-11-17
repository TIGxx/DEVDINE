"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CartStore } from "@/lib/cart-store"
import type { CartItem } from "@/lib/types"

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const items = CartStore.getCart()
    const totalAmount = CartStore.getTotal()

    if (items.length === 0) {
      router.push("/menu")
      return
    }

    setCartItems(items)
    setTotal(totalAmount)
  }, [router])

  const handleCheckout = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      const customerInfo = localStorage.getItem("customerInfo")
      const orderType = localStorage.getItem("orderType")

      if (!customerInfo || !orderType) {
        throw new Error("Missing customer information")
      }

      const { name, email } = JSON.parse(customerInfo)

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          orderType: orderType,
          paymentMethod: paymentMethod,
          items: cartItems,
          totalAmount: total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      console.log("[v0] Order created successfully:", data.orderId)

      // Clear cart
      CartStore.clearCart()

      // Redirect to bill page
      router.push(`/bill/${data.orderId}`)
    } catch (err) {
      console.error("[v0] Checkout error:", err)
      setError(err instanceof Error ? err.message : "Failed to process order")
      setIsProcessing(false)
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
          <button onClick={() => router.push("/cart")} className="text-gray-700 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </header>

      <main className="px-4 py-6 pb-32 max-w-2xl mx-auto">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.price} B × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">{(item.price * item.quantity).toFixed(2)} B</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-[#C41E3A]">{total.toFixed(2)} B</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
          <div className="space-y-3">
            {[
              { id: "cash", label: "Cash", icon: "💵" },
              { id: "credit-card", label: "Credit Card", icon: "💳" },
              { id: "mobile-banking", label: "Mobile Banking", icon: "📱" },
              { id: "qr-code", label: "QR Code", icon: "📲" },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === method.id
                    ? "border-[#C41E3A] bg-[#C41E3A]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-3xl">{method.icon}</span>
                <span className="flex-1 text-left font-semibold text-gray-900">{method.label}</span>
                {paymentMethod === method.id && (
                  <svg className="w-6 h-6 text-[#C41E3A]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleCheckout}
          disabled={isProcessing || !paymentMethod}
          className="w-full bg-[#C41E3A] hover:bg-[#A01828] text-white font-bold py-3 rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "Confirm Order"}
        </button>
      </div>
    </div>
  )
}
