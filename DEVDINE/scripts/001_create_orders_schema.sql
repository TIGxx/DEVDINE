-- Create orders table to store customer orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_number INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('eat-here', 'take-home')),
  payment_method TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create order_items table to store individual items in each order
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create queue_counter table to track queue numbers (resets daily)
CREATE TABLE IF NOT EXISTS queue_counter (
  id INTEGER PRIMARY KEY DEFAULT 1,
  current_number INTEGER NOT NULL DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE
);

-- Insert initial queue counter record
INSERT INTO queue_counter (id, current_number, last_reset_date)
VALUES (1, 0, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- Create index for faster order lookups
CREATE INDEX IF NOT EXISTS idx_orders_queue_number ON orders(queue_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable Row Level Security (RLS) for security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_counter ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since this is a restaurant ordering system)
-- In production, you might want to restrict this further
CREATE POLICY "Allow public to insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to view orders" ON orders FOR SELECT USING (true);

CREATE POLICY "Allow public to insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to view order_items" ON order_items FOR SELECT USING (true);

CREATE POLICY "Allow public to view queue_counter" ON queue_counter FOR SELECT USING (true);
CREATE POLICY "Allow public to update queue_counter" ON queue_counter FOR UPDATE USING (true);
