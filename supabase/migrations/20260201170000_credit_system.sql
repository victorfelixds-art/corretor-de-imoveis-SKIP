-- Create audit log table
CREATE TABLE IF NOT EXISTS public.credit_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  credit_type TEXT NOT NULL CHECK (credit_type IN ('monthly', 'extra')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.credit_usage_logs ENABLE ROW LEVEL SECURITY;

-- Policies for logs
CREATE POLICY "Users can view own logs" ON public.credit_usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage logs" ON public.credit_usage_logs
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Function to increment extra credits (securely callable by service role or internal logic)
CREATE OR REPLACE FUNCTION public.increment_extra_credits(user_uuid UUID, amount INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Upsert to ensure record exists
  INSERT INTO public.proposal_credits (user_id, monthly_limit, monthly_used, extra_available)
  VALUES (user_uuid, 0, 0, amount)
  ON CONFLICT (user_id) DO UPDATE
  SET extra_available = public.proposal_credits.extra_available + amount,
      updated_at = NOW();
END;
$$;

-- Function to consume a credit (atomic)
CREATE OR REPLACE FUNCTION public.consume_credit()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_monthly_limit INT;
  v_monthly_used INT;
  v_extra_available INT;
BEGIN
  -- Check if user exists and lock row
  SELECT monthly_limit, monthly_used, extra_available
  INTO v_monthly_limit, v_monthly_used, v_extra_available
  FROM public.proposal_credits
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User credits record not found';
  END IF;

  -- Logic: Monthly first, then Extra
  IF v_monthly_used < v_monthly_limit THEN
    UPDATE public.proposal_credits
    SET monthly_used = monthly_used + 1,
        updated_at = NOW()
    WHERE user_id = v_user_id;

    INSERT INTO public.credit_usage_logs (user_id, credit_type)
    VALUES (v_user_id, 'monthly');

    RETURN 'monthly';
  ELSIF v_extra_available > 0 THEN
    UPDATE public.proposal_credits
    SET extra_available = extra_available - 1,
        updated_at = NOW()
    WHERE user_id = v_user_id;

    INSERT INTO public.credit_usage_logs (user_id, credit_type)
    VALUES (v_user_id, 'extra');

    RETURN 'extra';
  ELSE
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.consume_credit TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_extra_credits TO service_role;
