import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params
    const supabase = await createClient()

    // Fetch order details
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", orderId)

    if (itemsError) {
      return NextResponse.json({ error: "Failed to fetch order items" }, { status: 500 })
    }

    return NextResponse.json({
      order,
      items: items || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
