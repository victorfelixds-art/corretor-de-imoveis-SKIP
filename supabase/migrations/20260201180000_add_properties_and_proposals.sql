-- Add active_layout_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_layout_id TEXT;

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  address TEXT NOT NULL,
  sq_meters NUMERIC NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  features JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create proposals table
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  unit TEXT,
  final_price NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  payment_conditions JSONB NOT NULL DEFAULT '[]',
  layout_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Gerada',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Policies for properties
CREATE POLICY "Users can manage their own properties" ON public.properties
  FOR ALL USING (auth.uid() = user_id);

-- Policies for proposals
CREATE POLICY "Users can manage their own proposals" ON public.proposals
  FOR ALL USING (auth.uid() = user_id);

