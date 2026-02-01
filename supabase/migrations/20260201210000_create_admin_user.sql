-- Create admin user migration
-- This migration ensures the specified admin user exists and has the correct role

-- Enable pgcrypto extension for password hashing (bcrypt)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'victorfelixds@gmail.com';
  v_password TEXT := 'More702!';
  v_hashed_password TEXT;
BEGIN
  -- 1. Check if user already exists in auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  -- 2. If user does not exist, create it
  IF v_user_id IS NULL THEN
    -- Generate UUID for new user
    v_user_id := gen_random_uuid();
    
    -- Generate bcrypt hash (Supabase GoTrue compatible)
    -- gen_salt('bf') uses Blowfish based crypt (bcrypt)
    v_hashed_password := crypt(v_password, gen_salt('bf'));
    
    -- Insert new user into auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000', -- Default Supabase instance ID
      'authenticated',
      'authenticated',
      v_email,
      v_hashed_password,
      NOW(), -- Auto-confirm email
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin System"}', -- Metadata for the profile trigger
      NOW(),
      NOW(),
      '', -- Empty tokens to satisfy potential not-null constraints/defaults
      '',
      '',
      ''
    );
    
    -- Note: The trigger 'on_auth_user_created' defined in 20260201160000_setup_auth_and_profiles.sql
    -- will fire immediately after this INSERT and create the profile in public.profiles with role 'corretor'.
  END IF;

  -- 3. Ensure the profile has the 'admin' role
  -- We perform an update to handle both cases:
  -- a) User was just created (trigger created profile with 'corretor')
  -- b) User already existed (profile might be 'corretor' or 'admin')
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = v_user_id;

END $$;
