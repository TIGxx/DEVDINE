export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  image?: string
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface Order {
  id: string
  queue_number: number
  customer_name: string
  customer_email: string
  order_type: "eat-here" | "take-home"
  payment_method?: string
  total_amount: number
  created_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  item_name: string
  item_price: number
  quantity: number
}
