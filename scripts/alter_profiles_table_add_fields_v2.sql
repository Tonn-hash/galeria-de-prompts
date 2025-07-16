-- Este script adiciona as colunas 'date_of_birth' e 'gender' à tabela 'profiles'.
-- Execute-o UMA vez (pode usar “Run” na aba Scripts ou o console SQL do Supabase).

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(50);

-- Opcional: Se você quiser que o username seja único, adicione uma restrição:
-- ALTER TABLE public.profiles
-- ADD CONSTRAINT unique_username UNIQUE (username);
