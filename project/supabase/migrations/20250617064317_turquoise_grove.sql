/*
  # Enhanced System Schema with Admin Features

  1. New Tables
    - `profiles` - User profiles with enhanced role management
    - `menu_items` - Complete menu management system
    - `orders` - Enhanced order system with status tracking
    - `contact_info` - Dynamic contact information
    - `admin_logs` - Admin action logging
    - `notifications` - Real-time notification system

  2. Enhanced Features
    - Admin user management
    - Order status management with notifications
    - Comprehensive logging system
    - Real-time updates

  3. Security
    - Enhanced RLS policies
    - Admin action logging
    - Secure password reset functionality
*/

-- Create enhanced profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  role text DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create enhanced menu_items table
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

-- Create enhanced orders table
CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  order_details text NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'preparing', 'ready', 'delivered', 'cancelled')),
  admin_notes text DEFAULT '',
  processed_by uuid REFERENCES profiles(id),
  processed_at timestamptz,
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

-- Create admin_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_logs (
  id serial PRIMARY KEY,
  admin_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  target_type text NOT NULL,
  target_id text NOT NULL,
  details jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table for real-time updates
CREATE TABLE IF NOT EXISTS notifications (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
  related_order_id integer REFERENCES orders(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Enhanced Profiles policies
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

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
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

-- Enhanced Orders policies
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

-- Admin logs policies
CREATE POLICY "Admins can read admin logs"
  ON admin_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can create admin logs"
  ON admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create functions for logging admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action_type text,
  p_target_type text,
  p_target_id text,
  p_details jsonb DEFAULT '{}'
) RETURNS void AS $$
BEGIN
  INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, details)
  VALUES (auth.uid(), p_action_type, p_target_type, p_target_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for creating notifications
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type text DEFAULT 'info',
  p_order_id integer DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type, related_order_id)
  VALUES (p_user_id, p_title, p_message, p_type, p_order_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for order status updates
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM create_notification(
      NEW.customer_id,
      'Order Status Updated',
      'Your order #' || NEW.id || ' status has been updated to: ' || NEW.status,
      CASE 
        WHEN NEW.status = 'accepted' THEN 'success'
        WHEN NEW.status = 'rejected' THEN 'error'
        WHEN NEW.status = 'delivered' THEN 'success'
        ELSE 'info'
      END,
      NEW.id
    );
    
    -- Log admin action
    PERFORM log_admin_action(
      'order_status_update',
      'order',
      NEW.id::text,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'admin_notes', NEW.admin_notes
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_status_change();

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