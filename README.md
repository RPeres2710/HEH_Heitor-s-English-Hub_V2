<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Heitor's English Hub</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
<!-- Supabase JS SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>

<!-- ══════════════ LOGIN ══════════════ -->
<div id="loginScreen">
  <div class="login-box">
    <div class="login-logo">
      <div class="hub-mark">H</div>
      <h1>Heitor's English Hub</h1>
      <p>Sistema de Gestão Acadêmica</p>
    </div>
    <div class="login-tabs">
      <button class="login-tab active" onclick="switchLoginTab('professor')">👨‍🏫 Professor</button>
      <button class="login-tab" onclick="switchLoginTab('aluno')">🎓 Aluno</button>
    </div>
    <div id="panelProfessor" class="login-panel active">
      <label class="login-label">Senha de Acesso</label>
      <input type="password" class="login-input" id="profPass" placeholder="Digite sua senha"
             onkeydown="if(event.key==='Enter') doLogin('professor')">
      <button class="login-btn" onclick="doLogin('professor')">Entrar como Professor</button>
    </div>
    <div id="panelAluno" class="login-panel">
      <label class="login-label">Código de Matrícula</label>
      <input type="text" class="login-input" id="alunoCode" placeholder="Ex: HEH-2024-001"
             onkeydown="if(event.key==='Enter') doLogin('aluno')">
      <button class="login-btn" onclick="doLogin('aluno')">Acessar minha conta</button>
    </div>
    <div class="login-error"   id="loginError"></div>
    <div class="login-loading" id="loginLoading">⏳ Verificando...</div>
  </div>
</div>

<!-- ══════════════ APP ══════════════ -->
<div id="appScreen">
  <div class="app-layout">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <div class="brand-mark">H</div>
          <div>
            <div class="brand-name">Heitor's English Hub</div>
            <div class="brand-sub">Gestão Acadêmica</div>
          </div>
        </div>
      </div>
      <div class="sidebar-user">
        <div class="user-badge"><div class="dot"></div><span id="userBadgeLabel">Admin</span></div>
      </div>
      <nav class="sidebar-nav" id="sidebarNav"></nav>
      <div class="sidebar-footer">
        <button class="logout-btn" onclick="doLogout()">🚪 Sair</button>
      </div>
    </aside>

    <!-- MAIN -->
    <main class="main-content">
      <header class="topbar">
        <div class="topbar-title" id="topbarTitle">Dashboard</div>
        <div class="topbar-right">
          <span class="topbar-date" id="topbarDate"></span>
        </div>
      </header>

      <div class="page-body">

        <!-- DASHBOARD -->
        <div class="page" id="pageDashboard">
          <div class="stats-grid" id="statsGrid"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
            <div class="card">
              <div class="card-header"><span class="card-title">Distribuição por Nível</span></div>
              <div class="card-body"><div class="chart-bar-wrap" id="levelChart"></div></div>
            </div>
            <div class="card">
              <div class="card-header"><span class="card-title">⚠️ Alertas</span></div>
              <div class="card-body" id="alertsPanel"></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <span class="card-title">Alunos Recentes</span>
              <button class="btn btn-sm btn-secondary" onclick="navTo('alunos')">Ver todos</button>
            </div>
            <div class="card-body" style="padding-top:12px">
              <div class="table-wrap"><table id="recentTable"></table></div>
            </div>
          </div>
        </div>

        <!-- ALUNOS -->
        <div class="page" id="pageAlunos">
          <div class="search-row">
            <div class="search-input-wrap">
              <span class="search-icon">🔍</span>
              <input type="text" placeholder="Buscar aluno..." id="searchAlunos" oninput="renderAlunos()">
            </div>
            <select class="form-select" id="filterNivel" onchange="renderAlunos()" style="width:130px">
              <option value="">Todos os níveis</option>
              <option>A1</option><option>A2</option><option>B1</option>
              <option>B2</option><option>C1</option><option>C2</option>
            </select>
            <select class="form-select" id="filterStatus" onchange="renderAlunos()" style="width:140px">
              <option value="">Todos os status</option>
              <option>Ativo</option><option>Inativo</option><option>Pendente</option>
            </select>
            <button class="btn btn-primary" onclick="openModalAluno()">＋ Novo Aluno</button>
          </div>
          <div class="card">
            <div class="card-body" style="padding:0">
              <div class="table-wrap"><table id="alunosTable"></table></div>
            </div>
          </div>
        </div>

        <!-- DETALHE ALUNO -->
        <div class="page" id="pageDetalheAluno">
          <button class="btn btn-secondary btn-sm" onclick="navTo('alunos')" style="margin-bottom:16px">← Voltar</button>
          <div class="card" id="detalheAlunoCont"></div>
        </div>

        <!-- FINANCEIRO -->
        <div class="page" id="pageFinanceiro">
          <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
            <div class="stat-card success">
              <div class="stat-label">Receita Confirmada</div>
              <div class="stat-value" id="finReceita">R$ 0</div>
              <div class="stat-sub">pagamentos em dia</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Receita Esperada</div>
              <div class="stat-value" id="finEsperada">R$ 0</div>
              <div class="stat-sub">total alunos ativos</div>
            </div>
            <div class="stat-card danger">
              <div class="stat-label">Em Atraso</div>
              <div class="stat-value" id="finAtraso">0</div>
              <div class="stat-sub">alunos inadimplentes</div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">Controle de Pagamentos</span></div>
            <div class="card-body" style="padding-top:12px">
              <div class="table-wrap"><table id="financeTable"></table></div>
            </div>
          </div>
        </div>

        <!-- TURMAS -->
        <div class="page" id="pageTurmas">
          <div style="display:flex;justify-content:flex-end;margin-bottom:16px">
            <button class="btn btn-primary" onclick="openModal('modalTurma');document.getElementById('turmaEditId').value=''">＋ Nova Turma</button>
          </div>
          <div class="turma-grid" id="turmasGrid"></div>
        </div>

        <!-- BIBLIOTECA -->
        <div class="page" id="pageBiblioteca">
          <div class="search-row" id="matSearchRow">
            <div class="search-input-wrap">
              <span class="search-icon">🔍</span>
              <input type="text" placeholder="Buscar material..." id="searchMat" oninput="renderMateriais()">
            </div>
            <select class="form-select" id="filterMatNivel" onchange="renderMateriais()" style="width:130px">
              <option value="">Todos os níveis</option>
              <option>A1</option><option>A2</option><option>B1</option>
              <option>B2</option><option>C1</option><option>C2</option><option>Todos</option>
            </select>
            <select class="form-select" id="filterMatTipo" onchange="renderMateriais()" style="width:130px">
              <option value="">Todos os tipos</option>
              <option>PDF</option><option>Vídeo</option><option>Link</option><option>Áudio</option>
            </select>
            <button class="btn btn-primary" onclick="openModal('modalMaterial');document.getElementById('matEditId').value=''">＋ Novo Material</button>
          </div>
          <div class="material-grid" id="materiaisGrid"></div>
        </div>

        <!-- CONFIGURAÇÕES -->
        <div class="page" id="pageConfig">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
            <div class="card">
              <div class="card-header">
                <span class="card-title">Planos de Estudo</span>
                <button class="btn btn-sm btn-primary" onclick="openModal('modalPlano');document.getElementById('planoEditId').value=''">＋ Adicionar</button>
              </div>
              <div class="card-body" id="planosLista"></div>
            </div>
            <div class="card">
              <div class="card-header"><span class="card-title">Segurança</span></div>
              <div class="card-body">
                <div class="form-group" style="margin-bottom:14px">
                  <label class="form-label">Nova Senha do Professor</label>
                  <input type="password" class="form-input" id="newPass" placeholder="Nova senha">
                </div>
                <div class="form-group" style="margin-bottom:14px">
                  <label class="form-label">Confirmar Senha</label>
                  <input type="password" class="form-input" id="confPass" placeholder="Confirme a senha">
                </div>
                <button class="btn btn-primary" onclick="changePass()">Salvar Senha</button>
              </div>
            </div>
          </div>
        </div>

        <!-- PORTAL ALUNO -->
        <div class="page" id="pagePortal">
          <div class="portal-header">
            <div class="portal-welcome" id="portalWelcome">Olá!</div>
            <div class="portal-sub"    id="portalSub"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
            <div class="card">
              <div class="card-header"><span class="card-title">Meu Nível</span></div>
              <div class="card-body" id="portalNivel"></div>
            </div>
            <div class="card">
              <div class="card-header"><span class="card-title">Minha Turma</span></div>
              <div class="card-body" id="portalTurma"></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">📚 Materiais Disponíveis</span></div>
            <div class="card-body">
              <div class="material-grid" id="portalMateriais"></div>
            </div>
          </div>
        </div>

      </div><!-- /page-body -->
    </main>
  </div>
</div>

<!-- ══ MODAIS ══ -->

<!-- Modal Aluno -->
<div class="modal-overlay" id="modalAluno">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title" id="modalAlunoTitle">Novo Aluno</h2>
      <button class="modal-close" onclick="closeModal('modalAluno')">×</button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="alunoEditId">
      <div class="tabs">
        <button class="tab-btn active" onclick="switchTab(this,'tab-matricula')">Matrícula</button>
        <button class="tab-btn" onclick="switchTab(this,'tab-progresso')">Progresso</button>
        <button class="tab-btn" onclick="switchTab(this,'tab-financeiro')">Financeiro</button>
      </div>
      <div class="tab-panel active" id="tab-matricula">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Nome Completo *</label><input class="form-input" id="aNome" placeholder="Nome do aluno"></div>
          <div class="form-group"><label class="form-label">E-mail</label><input class="form-input" id="aEmail" placeholder="email@exemplo.com" type="email"></div>
          <div class="form-group"><label class="form-label">Telefone</label><input class="form-input" id="aTel" placeholder="(21) 99999-9999"></div>
          <div class="form-group"><label class="form-label">Nascimento</label><input class="form-input" type="date" id="aNasc"></div>
          <div class="form-group"><label class="form-label">Data de Matrícula</label><input class="form-input" type="date" id="aMatricula"></div>
          <div class="form-group"><label class="form-label">Status</label>
            <select class="form-select" id="aStatus"><option>Ativo</option><option>Inativo</option><option>Pendente</option></select>
          </div>
          <div class="form-group full"><label class="form-label">Observações</label><textarea class="form-textarea" id="aObs" placeholder="Notas sobre o aluno..."></textarea></div>
        </div>
      </div>
      <div class="tab-panel" id="tab-progresso">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Nível Atual</label>
            <select class="form-select" id="aNivel"><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option></select>
          </div>
          <div class="form-group"><label class="form-label">Turma</label>
            <select class="form-select" id="aTurma"><option value="">Sem turma</option></select>
          </div>
          <div class="form-group full"><label class="form-label">Anotações de Progresso</label>
            <textarea class="form-textarea" id="aProgresso" placeholder="Pontos fortes, áreas a melhorar..."></textarea>
          </div>
        </div>
      </div>
      <div class="tab-panel" id="tab-financeiro">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Plano</label>
            <select class="form-select" id="aPlano"><option value="">Selecione</option></select>
          </div>
          <div class="form-group"><label class="form-label">Forma de Pagamento</label>
            <select class="form-select" id="aPgto"><option>PIX</option><option>Boleto</option><option>Cartão</option><option>Dinheiro</option><option>Transferência</option></select>
          </div>
          <div class="form-group"><label class="form-label">Dia de Vencimento</label>
            <input class="form-input" type="number" id="aVenc" min="1" max="31" placeholder="Ex: 10">
          </div>
          <div class="form-group"><label class="form-label">Status Pgto</label>
            <select class="form-select" id="aPgtoStatus"><option>Em dia</option><option>Pendente</option><option>Atrasado</option></select>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('modalAluno')">Cancelar</button>
      <button class="btn btn-primary" onclick="saveAluno()">Salvar Aluno</button>
    </div>
  </div>
</div>

<!-- Modal Turma -->
<div class="modal-overlay" id="modalTurma">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title" id="modalTurmaTitle">Nova Turma</h2>
      <button class="modal-close" onclick="closeModal('modalTurma')">×</button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="turmaEditId">
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Nome da Turma *</label><input class="form-input" id="tNome" placeholder="Ex: Turma B1 Manhã"></div>
        <div class="form-group"><label class="form-label">Nível</label>
          <select class="form-select" id="tNivel"><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option></select>
        </div>
        <div class="form-group"><label class="form-label">Horário</label><input class="form-input" id="tHorario" placeholder="Ex: Seg/Qua 19h–20h"></div>
        <div class="form-group"><label class="form-label">Modalidade</label>
          <select class="form-select" id="tModalidade"><option>Online</option><option>Presencial</option><option>Híbrido</option></select>
        </div>
        <div class="form-group full"><label class="form-label">Descrição</label><textarea class="form-textarea" id="tDesc"></textarea></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('modalTurma')">Cancelar</button>
      <button class="btn btn-primary" onclick="saveTurma()">Salvar Turma</button>
    </div>
  </div>
</div>

<!-- Modal Material -->
<div class="modal-overlay" id="modalMaterial">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title" id="modalMaterialTitle">Novo Material</h2>
      <button class="modal-close" onclick="closeModal('modalMaterial')">×</button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="matEditId">
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Título *</label><input class="form-input" id="mTitulo" placeholder="Nome do material"></div>
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="mTipo"><option>PDF</option><option>Vídeo</option><option>Link</option><option>Áudio</option></select>
        </div>
        <div class="form-group"><label class="form-label">Nível</label>
          <select class="form-select" id="mNivel"><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option><option>Todos</option></select>
        </div>
        <div class="form-group"><label class="form-label">Tema</label>
          <select class="form-select" id="mTema"><option>Gramática</option><option>Vocabulário</option><option>Conversação</option><option>Leitura</option><option>Escrita</option><option>Pronúncia</option><option>Geral</option></select>
        </div>
        <div class="form-group full"><label class="form-label">Link / URL *</label><input class="form-input" id="mLink" placeholder="https://drive.google.com/..."></div>
        <div class="form-group full"><label class="form-label">Descrição</label><textarea class="form-textarea" id="mDesc" placeholder="Breve descrição do conteúdo..."></textarea></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('modalMaterial')">Cancelar</button>
      <button class="btn btn-primary" onclick="saveMaterial()">Salvar Material</button>
    </div>
  </div>
</div>

<!-- Modal Plano -->
<div class="modal-overlay" id="modalPlano">
  <div class="modal" style="width:420px">
    <div class="modal-header">
      <h2 class="modal-title">Novo Plano</h2>
      <button class="modal-close" onclick="closeModal('modalPlano')">×</button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="planoEditId">
      <div class="form-grid">
        <div class="form-group full"><label class="form-label">Nome do Plano *</label><input class="form-input" id="pNome" placeholder="Ex: Individual 2x/semana"></div>
        <div class="form-group"><label class="form-label">Valor (R$) *</label><input class="form-input" type="number" id="pValor" placeholder="0,00"></div>
        <div class="form-group"><label class="form-label">Frequência</label>
          <select class="form-select" id="pFreq"><option>Mensal</option><option>Semanal</option><option>Trimestral</option><option>Semestral</option></select>
        </div>
        <div class="form-group full"><label class="form-label">Descrição</label><textarea class="form-textarea" id="pDesc"></textarea></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('modalPlano')">Cancelar</button>
      <button class="btn btn-primary" onclick="savePlano()">Salvar Plano</button>
    </div>
  </div>
</div>

<!-- Modal Confirmar Exclusão -->
<div class="modal-overlay" id="modalConfirm">
  <div class="modal" style="width:380px">
    <div class="modal-header">
      <h2 class="modal-title">Confirmar Exclusão</h2>
      <button class="modal-close" onclick="closeModal('modalConfirm')">×</button>
    </div>
    <div class="modal-body">
      <p style="font-size:14px;color:var(--text-secondary)" id="confirmMsg">Deseja realmente excluir?</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('modalConfirm')">Cancelar</button>
      <button class="btn btn-danger" id="confirmBtn">Excluir</button>
    </div>
  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast"><span id="toastMsg"></span></div>

<!-- Scripts — ordem importa -->
<script src="js/config.js"></script>
<script src="js/db.js"></script>
<script src="js/app.js"></script>

</body>
</html>
