-- ============================================================
--  HEITOR'S ENGLISH HUB — Políticas de Acesso (RLS)
--  Execute via Supabase > SQL Editor
--  Permite que a chave anon acesse todas as tabelas.
-- ============================================================

-- PLANOS
CREATE POLICY "anon_planos_select" ON planos FOR SELECT TO anon USING (true);
CREATE POLICY "anon_planos_insert" ON planos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_planos_update" ON planos FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_planos_delete" ON planos FOR DELETE TO anon USING (true);

-- TURMAS
CREATE POLICY "anon_turmas_select" ON turmas FOR SELECT TO anon USING (true);
CREATE POLICY "anon_turmas_insert" ON turmas FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_turmas_update" ON turmas FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_turmas_delete" ON turmas FOR DELETE TO anon USING (true);

-- ALUNOS
CREATE POLICY "anon_alunos_select" ON alunos FOR SELECT TO anon USING (true);
CREATE POLICY "anon_alunos_insert" ON alunos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_alunos_update" ON alunos FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_alunos_delete" ON alunos FOR DELETE TO anon USING (true);

-- MATERIAIS
CREATE POLICY "anon_materiais_select" ON materiais FOR SELECT TO anon USING (true);
CREATE POLICY "anon_materiais_insert" ON materiais FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_materiais_update" ON materiais FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_materiais_delete" ON materiais FOR DELETE TO anon USING (true);

-- PAGAMENTOS
CREATE POLICY "anon_pagamentos_select" ON pagamentos FOR SELECT TO anon USING (true);
CREATE POLICY "anon_pagamentos_insert" ON pagamentos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_pagamentos_update" ON pagamentos FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_pagamentos_delete" ON pagamentos FOR DELETE TO anon USING (true);

-- ============================================================
--  Acesso às Views via anon
-- ============================================================

GRANT SELECT ON vw_alunos_completo    TO anon;
GRANT SELECT ON vw_resumo_financeiro  TO anon;
GRANT SELECT ON vw_distribuicao_nivel TO anon;

-- Acesso à tabela de configurações (sem RLS, mas garante o grant)
GRANT SELECT, INSERT, UPDATE ON configuracoes TO anon;

-- ============================================================
--  FIM
-- ============================================================
