"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CartButton } from "@/components/cart-button"
import { CartStore } from "@/lib/cart-store"
import type { MenuItem } from "@/lib/types"

const MENU_ITEMS: MenuItem[] = [
  { id: "1", name: "Omelet", price: 50, category: "fried" },
  { id: "2", name: "Fried Chicken", price: 50, category: "fried" },
  { id: "3", name: "Crab Fried Rice", price: 50, category: "rice" },
  { id: "4", name: "Fried Shrimp Cake", price: 50, category: "fried" },
  { id: "5", name: "Spicy Shrimp Soup", price: 50, category: "soup" },
  { id: "6", name: "Rice", price: 50, category: "rice" },
  { id: "7", name: "Water", price: 50, category: "drink" },
  { id: "8", name: "Cocacola", price: 50, category: "drink" },
  { id: "9", name: "Ice", price: 50, category: "drink" },
]

export default function MenuPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Check if customer info exists
    const customerInfo = localStorage.getItem("customerInfo")
    if (!customerInfo) {
      router.push("/")
    }
  }, [router])

  const filteredItems =
    selectedCategory === "all" ? MENU_ITEMS : MENU_ITEMS.filter((item) => item.category === selectedCategory)

  const handleAddToCart = (item: MenuItem) => {
    CartStore.addItem(item)
    setAddedItems((prev) => new Set(prev).add(item.id))
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(item.id)
        return newSet
      })
    }, 1000)
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
            <button onClick={() => router.push("/")}>
              <h1 className="text-2xl font-bold text-gray-900">DEVDINE</h1>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <CartButton />
            <button onClick={() => router.push("/")} className="text-gray-700 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="bg-[#C41E3A] text-white sticky top-0 z-40">
        <div className="flex items-center justify-around px-4 py-3 text-sm font-semibold overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "fried", label: "Fried" },
            { id: "soup", label: "Soup" },
            { id: "rice", label: "Rice" },
            { id: "drink", label: "Drink" },
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`hover:opacity-80 transition-opacity px-3 py-1 rounded ${
                selectedCategory === category.id ? "bg-white/20 font-bold" : ""
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Menu Items */}
      <main className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
          {selectedCategory === "all" ? "All Items" : selectedCategory}
        </h2>

        <div className="grid grid-cols-3 gap-3 mb-20">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-[#C8D5B9] rounded-2xl p-3 flex flex-col items-center">
              <div className="w-20 h-20 bg-[#E57373] rounded-full mb-2 flex items-center justify-center overflow-hidden">
                <img
                  src={`/.jpg?height=80&width=80&query=${encodeURIComponent(item.name)}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 text-center mb-1">{item.name}</h3>
              <p className="text-xs text-gray-700 mb-2">{item.price} B</p>
              <button
                onClick={() => handleAddToCart(item)}
                className={`text-white text-xs font-semibold px-4 py-1 rounded-full transition-colors ${
                  addedItems.has(item.id) ? "bg-green-600" : "bg-[#C41E3A] hover:bg-[#A01828]"
                }`}
              >
                {addedItems.has(item.id) ? "ADDED!" : "ORDER!"}
              </button>
            </div>
          ))}
        </div>

        {/* Checkout Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={() => router.push("/cart")}
            className="w-full bg-[#C41E3A] hover:bg-[#A01828] text-white font-bold py-3 rounded-full transition-colors shadow-lg"
          >
            View Cart & Checkout
          </button>
        </div>
      </main>

     

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-[#c41e1e] hover:bg-[#a01818] text-white w-12 h-12 rounded-lg shadow-lg transition-colors flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  )
} 