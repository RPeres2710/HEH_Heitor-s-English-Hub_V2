-- ============================================================
--  HEITOR'S ENGLISH HUB — Supabase Schema
--  Gerado por Movisafe / Romario Peres
--  Execute via Supabase > SQL Editor
-- ============================================================

-- Extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
--  TABELAS
-- ============================================================

-- PLANOS DE ESTUDO
CREATE TABLE IF NOT EXISTS planos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  valor       NUMERIC(10,2) NOT NULL,
  frequencia  TEXT NOT NULL DEFAULT 'Mensal',
  descricao   TEXT,
  ativo       BOOLEAN DEFAULT TRUE,
  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- TURMAS
CREATE TABLE IF NOT EXISTS turmas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  nivel       TEXT NOT NULL CHECK (nivel IN ('A1','A2','B1','B2','C1','C2')),
  horario     TEXT,
  modalidade  TEXT DEFAULT 'Online' CHECK (modalidade IN ('Online','Presencial','Híbrido')),
  descricao   TEXT,
  ativa       BOOLEAN DEFAULT TRUE,
  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ALUNOS
CREATE TABLE IF NOT EXISTS alunos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo          TEXT UNIQUE NOT NULL,          -- ex: HEH-2024-001
  nome            TEXT NOT NULL,
  email           TEXT,
  telefone        TEXT,
  data_nascimento DATE,
  data_matricula  DATE DEFAULT CURRENT_DATE,
  status          TEXT DEFAULT 'Ativo' CHECK (status IN ('Ativo','Inativo','Pendente')),
  observacoes     TEXT,
  -- Progresso
  nivel           TEXT DEFAULT 'A1' CHECK (nivel IN ('A1','A2','B1','B2','C1','C2')),
  turma_id        UUID REFERENCES turmas(id) ON DELETE SET NULL,
  anotacoes_prog  TEXT,
  -- Financeiro
  plano_id        UUID REFERENCES planos(id) ON DELETE SET NULL,
  forma_pgto      TEXT DEFAULT 'PIX' CHECK (forma_pgto IN ('PIX','Boleto','Cartão','Dinheiro','Transferência')),
  dia_vencimento  SMALLINT CHECK (dia_vencimento BETWEEN 1 AND 31),
  status_pgto     TEXT DEFAULT 'Em dia' CHECK (status_pgto IN ('Em dia','Pendente','Atrasado')),
  -- Auth portal
  codigo_acesso   TEXT,                          -- hash do código de login do aluno
  criado_em       TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- MATERIAIS DE ENSINO
CREATE TABLE IF NOT EXISTS materiais (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT NOT NULL,
  tipo        TEXT NOT NULL CHECK (tipo IN ('PDF','Vídeo','Link','Áudio')),
  nivel       TEXT NOT NULL CHECK (nivel IN ('A1','A2','B1','B2','C1','C2','Todos')),
  tema        TEXT DEFAULT 'Geral' CHECK (tema IN ('Gramática','Vocabulário','Conversação','Leitura','Escrita','Pronúncia','Geral')),
  link_url    TEXT NOT NULL,
  descricao   TEXT,
  publico     BOOLEAN DEFAULT TRUE,              -- TRUE = visível para alunos
  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- HISTÓRICO DE PAGAMENTOS
CREATE TABLE IF NOT EXISTS pagamentos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id    UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  plano_id    UUID REFERENCES planos(id) ON DELETE SET NULL,
  valor       NUMERIC(10,2) NOT NULL,
  mes_ref     DATE NOT NULL,                     -- primeiro dia do mês de referência
  status      TEXT DEFAULT 'Pendente' CHECK (status IN ('Pago','Pendente','Atrasado','Cancelado')),
  forma_pgto  TEXT,
  observacao  TEXT,
  pago_em     TIMESTAMPTZ,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- CONFIGURAÇÕES DO SISTEMA
CREATE TABLE IF NOT EXISTS configuracoes (
  chave       TEXT PRIMARY KEY,
  valor       TEXT,
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  TRIGGERS — updated_at automático
-- ============================================================

CREATE OR REPLACE FUNCTION set_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_planos_upd    ON planos;
DROP TRIGGER IF EXISTS trg_turmas_upd    ON turmas;
DROP TRIGGER IF EXISTS trg_alunos_upd    ON alunos;
DROP TRIGGER IF EXISTS trg_materiais_upd ON materiais;

CREATE TRIGGER trg_planos_upd    BEFORE UPDATE ON planos    FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
CREATE TRIGGER trg_turmas_upd    BEFORE UPDATE ON turmas    FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
CREATE TRIGGER trg_alunos_upd    BEFORE UPDATE ON alunos    FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
CREATE TRIGGER trg_materiais_upd BEFORE UPDATE ON materiais FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- ============================================================
--  VIEWS ÚTEIS
-- ============================================================

DROP VIEW IF EXISTS vw_alunos_completo CASCADE;
DROP VIEW IF EXISTS vw_resumo_financeiro CASCADE;
DROP VIEW IF EXISTS vw_distribuicao_nivel CASCADE;

-- Visão completa dos alunos com dados de plano e turma
CREATE VIEW vw_alunos_completo AS
SELECT
  a.id,
  a.codigo,
  a.nome,
  a.email,
  a.telefone,
  a.data_nascimento,
  a.data_matricula,
  a.status,
  a.observacoes,
  a.nivel,
  a.turma_id,
  a.anotacoes_prog,
  a.plano_id,
  a.status_pgto,
  a.dia_vencimento,
  a.forma_pgto,
  t.nome AS turma_nome,
  t.horario AS turma_horario,
  p.nome AS plano_nome,
  p.valor AS plano_valor,
  p.frequencia AS plano_freq,
  a.criado_em
FROM alunos a
LEFT JOIN turmas t ON a.turma_id = t.id
LEFT JOIN planos p ON a.plano_id = p.id;

-- Resumo financeiro por aluno (mês atual)
CREATE VIEW vw_resumo_financeiro AS
SELECT
  a.id AS aluno_id,
  a.nome,
  a.status_pgto,
  p.valor AS mensalidade,
  p.nome AS plano,
  pg.status AS pgto_mes_atual,
  pg.pago_em
FROM alunos a
LEFT JOIN planos p ON a.plano_id = p.id
LEFT JOIN pagamentos pg ON pg.aluno_id = a.id
  AND DATE_TRUNC('month', pg.mes_ref) = DATE_TRUNC('month', CURRENT_DATE)
WHERE a.status = 'Ativo';

-- Dashboard: distribuição por nível
CREATE VIEW vw_distribuicao_nivel AS
SELECT
  nivel,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status = 'Ativo') AS ativos
FROM alunos
GROUP BY nivel
ORDER BY nivel;

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE alunos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiais  ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas     ENABLE ROW LEVEL SECURITY;

-- O app usa autenticação própria (sem Supabase Auth).
-- Liberamos o role anon para todas as operações em todas as tabelas.
DROP POLICY IF EXISTS "anon_all" ON planos;
DROP POLICY IF EXISTS "anon_all" ON turmas;
DROP POLICY IF EXISTS "anon_all" ON alunos;
DROP POLICY IF EXISTS "anon_all" ON materiais;
DROP POLICY IF EXISTS "anon_all" ON pagamentos;

CREATE POLICY "anon_all" ON planos     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON turmas     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON alunos     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON materiais  FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON pagamentos FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
--  DADOS DE EXEMPLO (seed)
-- ============================================================

INSERT INTO planos (nome, valor, frequencia, descricao) VALUES
  ('Individual 1x/semana', 350.00, 'Mensal', 'Aula individual, uma vez por semana'),
  ('Individual 2x/semana', 580.00, 'Mensal', 'Aula individual, duas vezes por semana'),
  ('Grupo Turma',          280.00, 'Mensal', 'Aula em grupo, turma fixa')
ON CONFLICT DO NOTHING;

INSERT INTO turmas (nome, nivel, horario, modalidade, descricao) VALUES
  ('Turma A1 Noturna',       'A1', 'Seg/Qua 19h', 'Online',     'Turma iniciante noturna'),
  ('Turma B2 Manhã',         'B2', 'Ter/Qui 9h',  'Presencial', 'Turma intermediária avançada'),
  ('Turma C1 Conversação',   'C1', 'Sex 10h',     'Online',     'Foco em conversação avançada')
ON CONFLICT DO NOTHING;

INSERT INTO materiais (titulo, tipo, nivel, tema, link_url, descricao) VALUES
  ('Grammar in Use – Unidade 1',   'PDF',   'A1',   'Gramática',    'https://drive.google.com', 'Present Simple e To Be'),
  ('English Pronunciation Tips',   'Vídeo', 'A2',   'Pronúncia',    'https://youtube.com',      'Sons difíceis para falantes de português'),
  ('Business English Phrases',     'Link',  'B2',   'Vocabulário',  'https://bbc.co.uk',        'Frases para contexto profissional'),
  ('Advanced Listening – TED',     'Link',  'C1',   'Conversação',  'https://ted.com',          'Seleção de TED Talks avançados'),
  ('Phrasal Verbs Worksheet',      'PDF',   'B1',   'Gramática',    'https://drive.google.com', '50 phrasal verbs mais usados')
ON CONFLICT DO NOTHING;

INSERT INTO configuracoes (chave, valor) VALUES
  ('prof_pass_hash', 'heitor123'),   -- substituir por bcrypt em produção
  ('nome_curso',     'Heitor''s English Hub'),
  ('versao_schema',  '1.0.0')
ON CONFLICT (chave) DO NOTHING;

-- ============================================================
--  ÍNDICES DE PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_alunos_status       ON alunos(status);
CREATE INDEX IF NOT EXISTS idx_alunos_nivel        ON alunos(nivel);
CREATE INDEX IF NOT EXISTS idx_alunos_turma        ON alunos(turma_id);
CREATE INDEX IF NOT EXISTS idx_alunos_pgto_status  ON alunos(status_pgto);
CREATE INDEX IF NOT EXISTS idx_pagamentos_aluno    ON pagamentos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_mes      ON pagamentos(mes_ref);
CREATE INDEX IF NOT EXISTS idx_materiais_nivel     ON materiais(nivel);
CREATE INDEX IF NOT EXISTS idx_materiais_tipo      ON materiais(tipo);

-- ============================================================
--  FIM DO SCRIPT
-- ============================================================
