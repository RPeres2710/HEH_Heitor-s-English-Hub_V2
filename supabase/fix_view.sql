-- ============================================================
--  HEITOR'S ENGLISH HUB — Correção da view vw_alunos_completo
--  Execute via Supabase > SQL Editor se o schema já foi rodado antes.
-- ============================================================

CREATE OR REPLACE VIEW vw_alunos_completo AS
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

GRANT SELECT ON vw_alunos_completo TO anon;
