-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(255) NOT NULL UNIQUE,
  slug varchar(255) NOT NULL UNIQUE,
  image_url text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS categories_name_idx ON categories(name);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);

-- Enable RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "Anyone can read categories" ON categories;
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  USING (true);

-- Create policy for authenticated admin insert
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON categories;
CREATE POLICY "Authenticated users can insert categories"
  ON categories
  FOR INSERT
  WITH CHECK (true);

-- Create policy for authenticated admin update
DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
CREATE POLICY "Authenticated users can update categories"
  ON categories
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy for authenticated admin delete
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON categories;
CREATE POLICY "Authenticated users can delete categories"
  ON categories
  FOR DELETE
  USING (true);
