-- Security Review & RLS Hardening

-- 1. Ensure RLS is enabled on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_events ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins full access profiles" ON public.profiles;

DROP POLICY IF EXISTS "Users can manage their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users CRUD own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins read all properties" ON public.properties;

DROP POLICY IF EXISTS "Users can manage their own proposals" ON public.proposals;
DROP POLICY IF EXISTS "Users CRUD own proposals" ON public.proposals;
DROP POLICY IF EXISTS "Admins read all proposals" ON public.proposals;

DROP POLICY IF EXISTS "Users can view own credits" ON public.proposal_credits;
DROP POLICY IF EXISTS "Users view own credits" ON public.proposal_credits;
DROP POLICY IF EXISTS "Admins full access credits" ON public.proposal_credits;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins read all subscriptions" ON public.subscriptions;

DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins read all payments" ON public.payments;

DROP POLICY IF EXISTS "Users can view own proposal events" ON public.proposal_events;
DROP POLICY IF EXISTS "Users view own proposal events" ON public.proposal_events;
DROP POLICY IF EXISTS "Admins can manage proposal events" ON public.proposal_events;
DROP POLICY IF EXISTS "Admins full access proposal events" ON public.proposal_events;
DROP POLICY IF EXISTS "Public insert events" ON public.proposal_events;

-- 3. Define Helper Functions (if not exists)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Apply New Policies

-- PROFILES
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins full access profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- PROPERTIES
CREATE POLICY "Users CRUD own properties" ON public.properties FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins read all properties" ON public.properties FOR SELECT USING (public.is_admin());

-- PROPOSALS
CREATE POLICY "Users CRUD own proposals" ON public.proposals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins read all proposals" ON public.proposals FOR SELECT USING (public.is_admin());

-- PROPOSAL_CREDITS
CREATE POLICY "Users view own credits" ON public.proposal_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins full access credits" ON public.proposal_credits FOR ALL USING (public.is_admin());

-- SUBSCRIPTIONS
CREATE POLICY "Users view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins read all subscriptions" ON public.subscriptions FOR SELECT USING (public.is_admin());

-- PAYMENTS
CREATE POLICY "Users view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins read all payments" ON public.payments FOR SELECT USING (public.is_admin());

-- PROPOSAL_EVENTS
CREATE POLICY "Users view own proposal events" ON public.proposal_events 
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.proposals WHERE proposals.id = proposal_events.proposal_id AND proposals.user_id = auth.uid()));
CREATE POLICY "Admins full access proposal events" ON public.proposal_events FOR ALL USING (public.is_admin());
-- Public (anonymous) can only INSERT events (for tracking clicks)
CREATE POLICY "Public insert events" ON public.proposal_events FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 5. Immutability Trigger
CREATE OR REPLACE FUNCTION public.check_proposal_immutability()
RETURNS TRIGGER AS $$
BEGIN
    -- If PDF is already generated (pdf_url is not null), prevent changes to business fields
    IF OLD.pdf_url IS NOT NULL AND (
       OLD.property_id IS DISTINCT FROM NEW.property_id OR
       OLD.client_name IS DISTINCT FROM NEW.client_name OR
       OLD.final_price IS DISTINCT FROM NEW.final_price OR
       OLD.payment_conditions IS DISTINCT FROM NEW.payment_conditions
    ) THEN
       RAISE EXCEPTION 'Cannot modify proposal details after PDF generation.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_proposal_immutability ON public.proposals;
CREATE TRIGGER enforce_proposal_immutability
    BEFORE UPDATE ON public.proposals
    FOR EACH ROW
    EXECUTE FUNCTION public.check_proposal_immutability();
