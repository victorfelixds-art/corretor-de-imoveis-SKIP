-- Create proposal_events table
CREATE TABLE IF NOT EXISTS public.proposal_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('aceitar', 'ajustes')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.proposal_events ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can view all. Users can view their own proposal events.
CREATE POLICY "Users can view own proposal events" ON public.proposal_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.proposals
      WHERE proposals.id = proposal_events.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );
  
-- Policy: Admin can do everything
CREATE POLICY "Admins can manage proposal events" ON public.proposal_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert/Update Admin Settings for WhatsApp
INSERT INTO public.admin_settings (key, value, label, description)
VALUES
  ('whatsapp_accept_message', 'Olá! Aceito a proposta {{PROPOSTA.ID}}. Podemos avançar?', 'Mensagem Aceite (WhatsApp)', 'Mensagem pré-definida para aceite de proposta.'),
  ('whatsapp_adjust_message', 'Olá! Gostaria de ajustar a proposta {{PROPOSTA.ID}}.', 'Mensagem Ajustes (WhatsApp)', 'Mensagem pré-definida para solicitação de ajustes.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, label = EXCLUDED.label, description = EXCLUDED.description;
