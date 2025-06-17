supabase link --project-ref wepakyuuasxmdiimmqew
  supabase migration new new-migration
  supabase db push/*
  # Initial Database Schema for Roha Restaurant

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `phone` (text)
      - `role` (text, default 'customer')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `menu_items`
      - `id` (serial, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text)
      - `image_url` (text)
      - `size` (text)
      - `popular` (boolean, default false)
      - `spicy` (boolean, default false)
      - `available` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `orders`
      - `id` (serial, primary key)
      - `customer_id` (uuid, references profiles)
      - `customer_name` (text)
      - `customer_phone` (text)
      - `order_details` (text)
      - `total_amount` (numeric)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `contact_info`
      - `id` (serial, primary key)
      - `phone` (text)
      - `email` (text)
      - `address` (text)
      - `map_embed_url` (text)
      - `whatsapp_number` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for admin users to manage all data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  role text DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  category text NOT NULL,
  image_url text NOT NULL,
  size text DEFAULT '',
  popular boolean DEFAULT false,
  spicy boolean DEFAULT false,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  order_details text NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id serial PRIMARY KEY,
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  map_embed_url text NOT NULL,
  whatsapp_number text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Menu items policies
CREATE POLICY "Anyone can read available menu items"
  ON menu_items
  FOR SELECT
  TO authenticated
  USING (available = true);

CREATE POLICY "Admins can manage menu items"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can read all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Contact info policies
CREATE POLICY "Anyone can read contact info"
  ON contact_info
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage contact info"
  ON contact_info
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default contact info
INSERT INTO contact_info (phone, email, address, map_embed_url, whatsapp_number) VALUES
('+251953037583', 'rohaburgerandpizza@gmail.com', 'Bole Road, Near Atlas Hotel, Addis Ababa, Ethiopia', 'https://maps.google.com/?q=Bole+Road+Addis+Ababa', '+251953037583')
ON CONFLICT DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category, image_url, size, popular, spicy) VALUES
('Margherita Pizza', 'Fresh mozzarella, tomato sauce, basil, olive oil', 280, 'pizza', 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400', 'Medium', true, false),
('Pepperoni Pizza', 'Spicy pepperoni, mozzarella cheese, tomato sauce', 320, 'pizza', 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400', 'Medium', true, false),
('Ethiopian Special Pizza', 'Local spices, berbere sauce, cheese, vegetables', 350, 'pizza', 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400', 'Medium', false, true),
('Classic Beef Burger', 'Beef patty, lettuce, tomato, onion, cheese, special sauce', 220, 'burgers', 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400', 'Regular', true, false),
('Chicken Burger', 'Grilled chicken breast, avocado, lettuce, mayo', 200, 'burgers', 'https://images.pexels.com/photos/552056/pexels-photo-552056.jpeg?auto=compress&cs=tinysrgb&w=400', 'Regular', false, false),
('French Fries', 'Golden crispy fries with seasoning', 60, 'sides', 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400', 'Regular', false, false),
('Ethiopian Coffee', 'Traditional Ethiopian coffee ceremony style', 40, 'drinks', 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400', 'Regular', false, false),
('Fresh Juice', 'Orange, mango, or mixed fruit juice', 50, 'drinks', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400', 'Regular', false, false)
ON CONFLICT DO NOTHING;