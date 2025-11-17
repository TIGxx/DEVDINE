"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { BillActions } from "./bill-actions"

interface OrderItem {
  id: string
  item_name: string
  item_price: number
  quantity: number
}

interface Order {
  id: string
  queue_number: number
  customer_name: string
  customer_email: string
  order_type: string
  payment_method: string
  total_amount: number
  created_at: string
}

export default function BillPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params
  const [orderData, setOrderData] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`)

        if (!response.ok) {
          setError(true)
          setLoading(false)
          return
        }

        const data = await response.json()
        setOrderData(data.order)
        setOrderItems(data.items)
        setLoading(false)

        console.log(" Bill page data loaded:", data)
      } catch (err) {
        console.error(" Error fetching order:", err)
        setError(true)
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#C41E3A] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your order...</p>
        </div>
      </div>
    )
  }

  if (error || !orderData) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* Header */}
      <header className="bg-[#FFF8E7] border-b border-gray-200">
        <div className="flex items-center justify-center px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-IVXQ4JWg3zR7d7S15IXHAR5pXgOXre.png"
              alt="DEVDINE Logo"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-900">DEVDINE</h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-8 max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600">Thank you for your order. Your food will be ready soon.</p>
        </div>

        {/* Queue Number */}
        <div className="bg-[#C41E3A] rounded-2xl p-8 text-center mb-6 shadow-lg">
          <p className="text-white text-lg mb-2">Your Queue Number</p>
          <p className="text-white text-7xl font-black tracking-wider">
            {orderData.queue_number.toString().padStart(3, "0")}
          </p>
        </div>

        {/* Bill Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Order Details</h3>

          {/* Customer Info */}
          <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-semibold text-gray-900">{orderData.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-semibold text-gray-900">{orderData.customer_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Type:</span>
              <span className="font-semibold text-gray-900 capitalize">{orderData.order_type.replace("-", " ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold text-gray-900 capitalize">
                {orderData.payment_method.replace("-", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Time:</span>
              <span className="font-semibold text-gray-900">
                {new Date(orderData.created_at).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
            <h4 className="font-bold text-gray-900">Items Ordered:</h4>
            {orderItems.length > 0 ? (
              orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.item_name}</p>
                    <p className="text-sm text-gray-600">
                      {item.item_price} B × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">{(item.item_price * item.quantity).toFixed(2)} B</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No items found</p>
            )}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total Amount:</span>
            <span className="text-3xl font-black text-[#C41E3A]">{orderData.total_amount.toFixed(2)} B</span>
          </div>
        </div>

        {/* Action Buttons */}
        <BillActions customerEmail={orderData.customer_email} />

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Please keep this receipt for your records.</p>
          <p className="mt-2">A confirmation email has been sent to {orderData.customer_email}</p>
        </div>
      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          header,
          button,
          a {
            display: none !important;
          }
          main {
            max-width: 100% !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  )
}
