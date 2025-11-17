"use client"

import Link from "next/link"

export function BillActions({ customerEmail }: { customerEmail: string }) {
  return (
    <div className="space-y-3">
      <button
        onClick={() => window.print()}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-full transition-colors"
      >
        Print Receipt
      </button>
      <Link
        href="/"
        className="block w-full bg-[#C41E3A] hover:bg-[#A01828] text-white font-bold py-3 rounded-full transition-colors text-center"
      >
        Place New Order
      </Link>
    </div>
  )
}
