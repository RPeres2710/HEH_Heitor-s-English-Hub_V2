-- Migration: adiciona coluna codigo_acesso se ainda não existir
-- Execute no Supabase SQL Editor caso seu banco já exista e não tenha essa coluna.

ALTER TABLE alunos
  ADD COLUMN IF NOT EXISTS codigo_acesso TEXT DEFAULT NULL;

-- Índice opcional para buscas de login (pequena otimização)
CREATE INDEX IF NOT EXISTS idx_alunos_codigo_acesso ON alunos(codigo_acesso)
  WHERE codigo_acesso IS NOT NULL;
