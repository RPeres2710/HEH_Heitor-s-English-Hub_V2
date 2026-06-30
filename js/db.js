// ============================================================
//  db.js — Camada de dados (Supabase)
//  Todas as operações de banco passam por aqui.
// ============================================================

const DB = {

  // ── PLANOS ──────────────────────────────────────────────
  planos: {
    async listar() {
      const { data, error } = await supabase.from('planos').select('*').order('nome');
      if (error) throw error;
      return data;
    },
    async salvar(plano) {
      if (plano.id) {
        const { data, error } = await supabase.from('planos').update(plano).eq('id', plano.id).select().single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from('planos').insert(plano).select().single();
        if (error) throw error;
        return data;
      }
    },
    async excluir(id) {
      const { error } = await supabase.from('planos').delete().eq('id', id);
      if (error) throw error;
    }
  },

  // ── TURMAS ──────────────────────────────────────────────
  turmas: {
    async listar() {
      const { data, error } = await supabase.from('turmas').select('*').order('nome');
      if (error) throw error;
      return data;
    },
    async salvar(turma) {
      if (turma.id) {
        const { data, error } = await supabase.from('turmas').update(turma).eq('id', turma.id).select().single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from('turmas').insert(turma).select().single();
        if (error) throw error;
        return data;
      }
    },
    async excluir(id) {
      const { error } = await supabase.from('turmas').delete().eq('id', id);
      if (error) throw error;
    }
  },

  // ── ALUNOS ──────────────────────────────────────────────
  alunos: {
    async listar(filtros = {}) {
      let query = supabase
        .from('vw_alunos_completo')
        .select('*')
        .order('nome');
      if (filtros.status)  query = query.eq('status', filtros.status);
      if (filtros.nivel)   query = query.eq('nivel', filtros.nivel);
      if (filtros.busca)   query = query.ilike('nome', `%${filtros.busca}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    async buscarPorId(id) {
      const { data, error } = await supabase.from('vw_alunos_completo').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    async buscarPorCodigo(codigo) {
      const { data, error } = await supabase.from('alunos').select('*').eq('codigo', codigo.toUpperCase()).single();
      if (error) return null;
      return data;
    },
    async salvar(aluno) {
      // Mapear campos do form para colunas do banco
      const payload = {
        nome:            aluno.nome,
        email:           aluno.email || null,
        telefone:        aluno.telefone || null,
        data_nascimento: aluno.data_nascimento || null,
        data_matricula:  aluno.data_matricula || new Date().toISOString().split('T')[0],
        status:          aluno.status,
        observacoes:     aluno.observacoes || null,
        nivel:           aluno.nivel,
        turma_id:        aluno.turma_id || null,
        anotacoes_prog:  aluno.anotacoes_prog || null,
        plano_id:        aluno.plano_id || null,
        forma_pgto:      aluno.forma_pgto,
        dia_vencimento:  aluno.dia_vencimento ? parseInt(aluno.dia_vencimento) : null,
        status_pgto:     aluno.status_pgto,
      };
      if (aluno.id) {
        const { data, error } = await supabase.from('alunos').update(payload).eq('id', aluno.id).select().single();
        if (error) throw error;
        return data;
      } else {
        payload.codigo = await DB.alunos._gerarCodigo();
        const { data, error } = await supabase.from('alunos').insert(payload).select().single();
        if (error) throw error;
        return data;
      }
    },
    async atualizarPgtoStatus(id, status) {
      const { error } = await supabase.from('alunos').update({ status_pgto: status }).eq('id', id);
      if (error) throw error;
    },
    async definirAcesso(id, senha) {
      const { error } = await supabase.from('alunos').update({ codigo_acesso: senha }).eq('id', id);
      if (error) throw error;
    },
    async removerAcesso(id) {
      const { error } = await supabase.from('alunos').update({ codigo_acesso: null }).eq('id', id);
      if (error) throw error;
    },
    async excluir(id) {
      const { error } = await supabase.from('alunos').delete().eq('id', id);
      if (error) throw error;
    },
    async _gerarCodigo() {
      const ano = new Date().getFullYear();
      const { count } = await supabase.from('alunos').select('*', { count: 'exact', head: true });
      const num = String((count || 0) + 1).padStart(3, '0');
      return `HEH-${ano}-${num}`;
    }
  },

  // ── MATERIAIS ───────────────────────────────────────────
  materiais: {
    async listar(filtros = {}) {
      let query = supabase.from('materiais').select('*').order('titulo');
      if (filtros.nivel && filtros.nivel !== 'Todos') query = query.or(`nivel.eq.${filtros.nivel},nivel.eq.Todos`);
      if (filtros.tipo)  query = query.eq('tipo', filtros.tipo);
      if (filtros.busca) query = query.ilike('titulo', `%${filtros.busca}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    async listarParaAluno(nivel) {
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .eq('publico', true)
        .or(`nivel.eq.${nivel},nivel.eq.Todos`)
        .order('titulo');
      if (error) throw error;
      return data;
    },
    async salvar(material) {
      if (material.id) {
        const { data, error } = await supabase.from('materiais').update(material).eq('id', material.id).select().single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from('materiais').insert(material).select().single();
        if (error) throw error;
        return data;
      }
    },
    async excluir(id) {
      const { error } = await supabase.from('materiais').delete().eq('id', id);
      if (error) throw error;
    }
  },

  // ── PAGAMENTOS ──────────────────────────────────────────
  pagamentos: {
    async listar(alunoId) {
      const { data, error } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('aluno_id', alunoId)
        .order('mes_ref', { ascending: false });
      if (error) throw error;
      return data;
    },
    async registrar(pagamento) {
      const { data, error } = await supabase.from('pagamentos').insert(pagamento).select().single();
      if (error) throw error;
      return data;
    }
  },

  // ── DASHBOARD ───────────────────────────────────────────
  dashboard: {
    async stats() {
      const [
        { count: totalAlunos },
        { count: alunosAtivos },
        { count: atrasados },
        { data: distribuicao }
      ] = await Promise.all([
        supabase.from('alunos').select('*', { count: 'exact', head: true }),
        supabase.from('alunos').select('*', { count: 'exact', head: true }).eq('status', 'Ativo'),
        supabase.from('alunos').select('*', { count: 'exact', head: true }).eq('status_pgto', 'Atrasado'),
        supabase.from('vw_distribuicao_nivel').select('*')
      ]);
      const { data: resumoFin } = await supabase.from('vw_resumo_financeiro').select('mensalidade, pgto_mes_atual');
      const receitaConf = (resumoFin||[]).filter(r => r.pgto_mes_atual === 'Pago').reduce((s,r) => s + (r.mensalidade||0), 0);
      const receitaEsp  = (resumoFin||[]).reduce((s,r) => s + (r.mensalidade||0), 0);
      return { totalAlunos, alunosAtivos, atrasados, distribuicao: distribuicao||[], receitaConf, receitaEsp };
    },
    async alertas() {
      const { data } = await supabase
        .from('alunos')
        .select('id, nome, status_pgto, dia_vencimento')
        .in('status_pgto', ['Atrasado','Pendente'])
        .eq('status', 'Ativo');
      return data || [];
    },
    async recentes() {
      const { data } = await supabase
        .from('vw_alunos_completo')
        .select('*')
        .order('criado_em', { ascending: false })
        .limit(5);
      return data || [];
    }
  },

  // ── CONFIGURAÇÕES ───────────────────────────────────────
  config: {
    async get(chave) {
      const { data } = await supabase.from('configuracoes').select('valor').eq('chave', chave).maybeSingle();
      return data?.valor ?? null;
    },
    async set(chave, valor) {
      const { error } = await supabase.from('configuracoes')
        .upsert({ chave, valor, atualizado_em: new Date().toISOString() }, { onConflict: 'chave' });
      if (error) throw error;
    }
  }
};
