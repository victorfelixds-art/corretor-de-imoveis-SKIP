-- Add new fields to profiles table for PDF generation
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS creci TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Function to refund a credit (securely callable by service role)
CREATE OR REPLACE FUNCTION public.refund_credit(p_user_id UUID, p_credit_type TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_credit_type = 'monthly' THEN
    UPDATE public.proposal_credits
    SET monthly_used = GREATEST(0, monthly_used - 1),
        updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSIF p_credit_type = 'extra' THEN
    UPDATE public.proposal_credits
    SET extra_available = extra_available + 1,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.refund_credit TO service_role;
