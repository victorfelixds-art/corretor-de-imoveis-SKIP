-- Create layouts table
CREATE TABLE IF NOT EXISTS public.layouts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    preview_url TEXT,
    category TEXT NOT NULL DEFAULT 'BASE', -- 'BASE', 'PRO', 'PRO_PLUS'
    gamma_template_id TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed layouts (migrating from constant)
INSERT INTO public.layouts (id, name, description, preview_url, category, is_active)
VALUES 
    ('layout-base-1', 'Layout Clássico', 'Um layout limpo e direto para propostas rápidas.', 'https://img.usecurling.com/p/300/400?q=document%20minimal&color=blue', 'BASE', true),
    ('layout-base-2', 'Layout Moderno', 'Estilo contemporâneo com foco em tipografia.', 'https://img.usecurling.com/p/300/400?q=document%20modern&color=gray', 'BASE', true),
    ('layout-pro-1', 'Layout Premium Gold', 'Acabamento sofisticado para imóveis de alto padrão.', 'https://img.usecurling.com/p/300/400?q=luxury%20document&color=yellow', 'PRO', true),
    ('layout-pro-2', 'Layout Dark Mode', 'Visual impactante com fundo escuro.', 'https://img.usecurling.com/p/300/400?q=dark%20ui%20document&color=black', 'PRO', true)
ON CONFLICT (id) DO NOTHING;

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    label TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed admin settings
INSERT INTO public.admin_settings (key, value, label, description)
VALUES 
    ('support_phone', '5511999999999', 'WhatsApp Suporte', 'Número do WhatsApp para suporte (apenas números).'),
    ('msg_accept', 'Olá, gostaria de aceitar a proposta do imóvel {imovel}.', 'Mensagem Aceite', 'Mensagem padrão ao aceitar proposta.'),
    ('msg_adjust', 'Olá, gostaria de solicitar ajustes na proposta do imóvel {imovel}.', 'Mensagem Ajustes', 'Mensagem padrão ao pedir ajustes.')
ON CONFLICT (key) DO NOTHING;

-- Create admin_logs table
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    action_type TEXT NOT NULL,
    description TEXT,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Layouts: Everyone can read active, Admin can read all/write
CREATE POLICY "Public read active layouts" ON public.layouts FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access layouts" ON public.layouts FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Admin Settings: Authenticated read, Admin write
CREATE POLICY "Authenticated read settings" ON public.admin_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin write settings" ON public.admin_settings FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Admin Logs: Admin only
CREATE POLICY "Admin full access logs" ON public.admin_logs FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Helper function to adjust credits (admin only)
CREATE OR REPLACE FUNCTION public.admin_adjust_credits(
    p_user_id UUID,
    p_monthly_delta INTEGER,
    p_extra_delta INTEGER,
    p_admin_id UUID,
    p_reason TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if caller is admin
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Update credits
    UPDATE public.proposal_credits
    SET monthly_limit = monthly_limit + p_monthly_delta,
        extra_available = extra_available + p_extra_delta,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- Log action
    INSERT INTO public.admin_logs (admin_id, action_type, description, target_id, details)
    VALUES (
        p_admin_id, 
        'CREDIT_ADJUSTMENT', 
        p_reason, 
        p_user_id, 
        jsonb_build_object('monthly_delta', p_monthly_delta, 'extra_delta', p_extra_delta)
    );
END;
$$;
