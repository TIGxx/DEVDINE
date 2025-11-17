import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { customerName, customerEmail, orderType, paymentMethod, items, totalAmount } = await request.json()

    if (!customerName || !customerEmail || !orderType || !paymentMethod || !items || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: queueData, error: queueError } = await supabase
      .from("queue_counter")
      .select("current_number, last_reset_date")
      .eq("id", 1)
      .maybeSingle()

    if (queueError) {
      console.error("[v0] Error fetching queue counter:", queueError)
      return NextResponse.json({ error: "Failed to generate queue number" }, { status: 500 })
    }

    const today = new Date().toISOString().split("T")[0]
    let queueNumber = 1

    // If no queue counter exists, initialize it
    if (!queueData) {
      console.log("[v0] Initializing queue counter")
      const { error: insertError } = await supabase.from("queue_counter").insert({
        id: 1,
        current_number: 1,
        last_reset_date: today,
      })

      if (insertError) {
        console.error("[v0] Error initializing queue counter:", insertError)
        return NextResponse.json({ error: "Failed to initialize queue number" }, { status: 500 })
      }
    } else {
      // Calculate next queue number
      queueNumber = queueData.current_number + 1

      // Reset queue number if it's a new day
      if (queueData.last_reset_date !== today) {
        queueNumber = 1
      }

      // Update queue counter
      const { error: updateError } = await supabase
        .from("queue_counter")
        .update({
          current_number: queueNumber,
          last_reset_date: today,
        })
        .eq("id", 1)

      if (updateError) {
        console.error("[v0] Error updating queue counter:", updateError)
        return NextResponse.json({ error: "Failed to update queue number" }, { status: 500 })
      }
    }

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        queue_number: queueNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        order_type: orderType,
        payment_method: paymentMethod,
        total_amount: totalAmount,
      })
      .select()
      .single()

    if (orderError) {
      console.error("[v0] Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      item_name: item.name,
      item_price: item.price,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("[v0] Error creating order items:", itemsError)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    console.log("[v0] Order created successfully:", orderData.id)

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      queueNumber: queueNumber,
    })
  } catch (error) {
    console.error("[v0] Error processing order:", error)
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 })
  }
}
