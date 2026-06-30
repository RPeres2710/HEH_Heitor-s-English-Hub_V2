// ============================================================
//  app.js — Lógica principal da aplicação
// ============================================================

// ── ESTADO GLOBAL ──────────────────────────────────────────
let currentUser = null; // { role: 'professor' | 'aluno', alunoId, alunoNome, alunoNivel }

const NIVEIS = ['A1','A2','B1','B2','C1','C2'];
const NIVEL_CORES = { A1:'#94A3B8', A2:'#64748B', B1:'#3B82F6', B2:'#8B5CF6', C1:'#F59E0B', C2:'#10B981' };
const PAGE_TITLES = {
  dashboard:'Dashboard', alunos:'Alunos', detalheAluno:'Detalhe do Aluno',
  financeiro:'Financeiro', turmas:'Turmas', biblioteca:'Biblioteca de Materiais',
  config:'Configurações', portal:'Meu Painel'
};
const PROF_NAV = [
  { id:'dashboard',  icon:'📊', label:'Dashboard' },
  { id:'alunos',     icon:'👥', label:'Alunos' },
  { id:'financeiro', icon:'💳', label:'Financeiro' },
  { id:'turmas',     icon:'📚', label:'Turmas' },
  { id:'biblioteca', icon:'📁', label:'Biblioteca' },
  { id:'config',     icon:'⚙️', label:'Configurações' }
];

// ── AUTH ────────────────────────────────────────────────────
function switchLoginTab(tab) {
  document.querySelectorAll('.login-tab').forEach((t,i) =>
    t.classList.toggle('active', (i===0&&tab==='professor')||(i===1&&tab==='aluno')));
  document.getElementById('panelProfessor').classList.toggle('active', tab==='professor');
  document.getElementById('panelAluno').classList.toggle('active', tab==='aluno');
  document.getElementById('loginError').style.display = 'none';
}

async function doLogin(role) {
  const loadingEl = document.getElementById('loginLoading');
  const errorEl   = document.getElementById('loginError');
  loadingEl.style.display = 'block';
  errorEl.style.display   = 'none';
  try {
    if (role === 'professor') {
      const pass = document.getElementById('profPass').value;
      const stored = await DB.config.get('prof_pass_hash');
      if (pass === stored) {
        currentUser = { role: 'professor' };
        startApp();
      } else { showLoginError('Senha incorreta.'); }
    } else {
      const code = document.getElementById('alunoCode').value.trim();
      const pw   = document.getElementById('alunoPw').value.trim();
      const aluno = await DB.alunos.buscarPorCodigo(code);
      if (!aluno) {
        showLoginError('Código não encontrado.');
      } else if (aluno.status !== 'Ativo') {
        showLoginError('Matrícula inativa. Fale com o professor.');
      } else if (!aluno.codigo_acesso) {
        showLoginError('Acesso não habilitado. Fale com o professor.');
      } else if (pw !== aluno.codigo_acesso) {
        showLoginError('Senha incorreta.');
      } else {
        currentUser = { role:'aluno', alunoId: aluno.id, alunoNome: aluno.nome, alunoNivel: aluno.nivel, alunoCodigo: aluno.codigo };
        startApp();
      }
    }
  } catch(e) {
    showLoginError('Erro de conexão. Verifique as credenciais do Supabase.');
    console.error(e);
  } finally {
    loadingEl.style.display = 'none';
  }
}

function showLoginError(msg = 'Credenciais inválidas.') {
  const el = document.getElementById('loginError');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display='none', 4000);
}

function doLogout() {
  currentUser = null;
  document.getElementById('appScreen').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('profPass').value = '';
  document.getElementById('alunoCode').value = '';
  document.getElementById('alunoPw').value = '';
}

function startApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appScreen').style.display = 'block';
  buildNav();
  setTopbarDate();
  navTo(currentUser.role === 'professor' ? 'dashboard' : 'portal');
}

// ── NAV ─────────────────────────────────────────────────────
function buildNav() {
  const nav   = document.getElementById('sidebarNav');
  const badge = document.getElementById('userBadgeLabel');
  nav.innerHTML = '';
  if (currentUser.role === 'professor') {
    badge.textContent = 'Admin';
    PROF_NAV.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'nav-item';
      btn.dataset.page = item.id;
      btn.innerHTML = `<span class="nav-icon">${item.icon}</span>${item.label}`;
      btn.onclick = () => navTo(item.id);
      nav.appendChild(btn);
    });
  } else {
    badge.textContent = 'Aluno';
    [{ id:'portal', icon:'🏠', label:'Meu Painel' }, { id:'biblioteca', icon:'📁', label:'Materiais' }].forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'nav-item';
      btn.dataset.page = item.id;
      btn.innerHTML = `<span class="nav-icon">${item.icon}</span>${item.label}`;
      btn.onclick = () => navTo(item.id);
      nav.appendChild(btn);
    });
  }
}

function navTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n =>
    n.classList.toggle('active', n.dataset.page === page));
  const pageEl = document.getElementById('page' + page.charAt(0).toUpperCase() + page.slice(1));
  if (pageEl) pageEl.classList.add('active');
  document.getElementById('topbarTitle').textContent = PAGE_TITLES[page] || page;
  const renders = { dashboard: renderDashboard, alunos: renderAlunos, financeiro: renderFinanceiro, turmas: renderTurmas, biblioteca: renderMateriais, config: renderConfig, portal: renderPortal };
  if (renders[page]) renders[page]();
}

function setTopbarDate() {
  document.getElementById('topbarDate').textContent =
    new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

// ── HELPERS UI ──────────────────────────────────────────────
function levelBadge(n) {
  const c = { A1:'info', A2:'navy', B1:'info', B2:'warning', C1:'warning', C2:'success' };
  return `<span class="badge badge-${c[n]||'navy'}">${n}</span>`;
}
function statusBadge(s) {
  const c = { Ativo:'success', Inativo:'danger', Pendente:'warning' };
  return `<span class="badge badge-${c[s]||'navy'}">${s}</span>`;
}
function pgtoBadge(s) {
  const c = { 'Em dia':'success', Pendente:'warning', Atrasado:'danger' };
  return `<span class="badge badge-${c[s]||'navy'}">${s||'—'}</span>`;
}
function levelBar(nivel) {
  const idx = NIVEIS.indexOf(nivel);
  return `<div class="level-track">${NIVEIS.map((n,i)=>`<div class="level-seg${i<=idx?' filled '+n.toLowerCase():''}"></div>`).join('')}</div>
  <div class="level-labels">${NIVEIS.map(n=>`<div class="level-label-item${n===nivel?' current':''}">${n}</div>`).join('')}</div>`;
}

function showToast(msg, type='success') {
  const el = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  el.className = `toast show ${type}`;
  setTimeout(() => el.classList.remove('show'), 3000);
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m =>
  m.addEventListener('click', e => { if(e.target===m) m.classList.remove('open'); }));

function switchTab(btn, panelId) {
  btn.closest('.tabs').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const scope = btn.closest('.modal-body, .page, #detalheAlunoCont');
  if (scope) {
    scope.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(panelId);
    if (target) target.classList.add('active');
  }
}

// ── DASHBOARD ───────────────────────────────────────────────
async function renderDashboard() {
  try {
    const [stats, alertas, recentes] = await Promise.all([
      DB.dashboard.stats(), DB.dashboard.alertas(), DB.dashboard.recentes()
    ]);
    document.getElementById('statsGrid').innerHTML = `
      <div class="stat-card"><div class="stat-label">Alunos Ativos</div><div class="stat-value">${stats.alunosAtivos}</div><div class="stat-sub">de ${stats.totalAlunos} matriculados</div></div>
      <div class="stat-card success"><div class="stat-label">Receita Confirmada</div><div class="stat-value">R$ ${(stats.receitaConf||0).toLocaleString('pt-BR')}</div><div class="stat-sub">pagamentos em dia</div></div>
      <div class="stat-card info"><div class="stat-label">Receita Esperada</div><div class="stat-value">R$ ${(stats.receitaEsp||0).toLocaleString('pt-BR')}</div><div class="stat-sub">planos ativos</div></div>
      <div class="stat-card danger"><div class="stat-label">Em Atraso</div><div class="stat-value">${stats.atrasados}</div><div class="stat-sub">alunos inadimplentes</div></div>`;

    const max = Math.max(...(stats.distribuicao||[]).map(d=>d.ativos||0), 1);
    document.getElementById('levelChart').innerHTML = NIVEIS.map(n => {
      const d = (stats.distribuicao||[]).find(x=>x.nivel===n);
      const cnt = d?.ativos || 0;
      const pct = Math.round((cnt/max)*100);
      return `<div class="chart-bar-row"><div class="chart-bar-label">${n}</div><div class="chart-bar-track"><div class="chart-bar-fill" style="width:${pct}%;background:${NIVEL_CORES[n]}"></div></div><div class="chart-bar-count">${cnt}</div></div>`;
    }).join('');

    document.getElementById('alertsPanel').innerHTML = alertas.length
      ? alertas.map(a => `<div class="alert-item ${a.status_pgto==='Atrasado'?'alert-danger':'alert-warning'}">${a.status_pgto==='Atrasado'?'⚠️':'🔔'} <b>${a.nome}</b> — ${a.status_pgto}</div>`).join('')
      : '<div class="empty-state"><div class="empty-icon">✅</div><p>Sem alertas</p></div>';

    document.getElementById('recentTable').innerHTML = `
      <thead><tr><th>Nome</th><th>Nível</th><th>Status</th><th>Pgto</th><th></th></tr></thead>
      <tbody>${recentes.map(a=>`<tr>
        <td><b>${a.nome}</b><br><span style="font-size:11px;color:var(--text-muted)">${a.codigo||''}</span></td>
        <td>${levelBadge(a.nivel)}</td><td>${statusBadge(a.status)}</td><td>${pgtoBadge(a.status_pgto)}</td>
        <td><button class="btn btn-sm btn-secondary" onclick="openDetalhe('${a.id}')">Ver</button></td>
      </tr>`).join('')}</tbody>`;
  } catch(e) { showToast('Erro ao carregar dashboard', 'error'); console.error(e); }
}

// ── ALUNOS ──────────────────────────────────────────────────
async function renderAlunos() {
  const q  = document.getElementById('searchAlunos')?.value || '';
  const fn = document.getElementById('filterNivel')?.value  || '';
  const fs = document.getElementById('filterStatus')?.value || '';
  try {
    const alunos = await DB.alunos.listar({ busca: q, nivel: fn, status: fs });
    document.getElementById('alunosTable').innerHTML = `
      <thead><tr><th>Nome</th><th>Código</th><th>Nível</th><th>Turma</th><th>Status</th><th>Pgto</th><th>Ações</th></tr></thead>
      <tbody>${alunos.length ? alunos.map(a=>`<tr>
        <td><b>${a.nome}</b><br><span style="font-size:11px;color:var(--text-muted)">${a.email||''}</span></td>
        <td><code style="font-size:12px;background:var(--off-white);padding:2px 6px;border-radius:4px">${a.codigo}</code></td>
        <td>${levelBadge(a.nivel)}</td>
        <td>${a.turma_nome||'<span style="color:var(--text-muted);font-size:12px">—</span>'}</td>
        <td>${statusBadge(a.status)}</td>
        <td>${pgtoBadge(a.status_pgto)}</td>
        <td><div style="display:flex;gap:6px">
          <button class="btn btn-sm btn-secondary" onclick="openDetalhe('${a.id}')">👁</button>
          <button class="btn btn-sm btn-secondary" onclick="editAluno('${a.id}')">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="confirmDelete('aluno','${a.id}')">🗑</button>
        </div></td>
      </tr>`).join('') : '<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">👥</div><p>Nenhum aluno encontrado</p></div></td></tr>'}</tbody>`;
  } catch(e) { showToast('Erro ao carregar alunos', 'error'); console.error(e); }
}

async function openDetalhe(id) {
  try {
    const a = await DB.alunos.buscarPorId(id);
    const nivelIdx = NIVEIS.indexOf(a.nivel);
    document.getElementById('detalheAlunoCont').innerHTML = `
      <div class="detail-header">
        <div class="detail-avatar">${a.nome.charAt(0)}</div>
        <div>
          <div class="detail-name">${a.nome}</div>
          <div class="detail-meta">${a.email||''} ${a.telefone?'· '+a.telefone:''}</div>
          <div style="margin-top:8px;display:flex;gap:8px">${statusBadge(a.status)} ${levelBadge(a.nivel)} ${pgtoBadge(a.status_pgto)}</div>
        </div>
        <div style="margin-left:auto">
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.2)" onclick="editAluno('${a.id}')">✏️ Editar</button>
        </div>
      </div>
      <div style="padding:24px">
        <div class="tabs">
          <button class="tab-btn active" onclick="switchTab(this,'det-geral')">Geral</button>
          <button class="tab-btn" onclick="switchTab(this,'det-nivel')">Nível & Progresso</button>
          <button class="tab-btn" onclick="switchTab(this,'det-fin')">Financeiro</button>
        </div>
        <div class="tab-panel active" id="det-geral">
          <div class="form-grid">
            <div><div class="form-label">Código</div><code style="background:var(--off-white);padding:4px 8px;border-radius:4px;font-size:14px">${a.codigo}</code></div>
            <div><div class="form-label">Matrícula</div><div style="font-size:14px;margin-top:4px">${a.data_matricula||'—'}</div></div>
            <div><div class="form-label">Nascimento</div><div style="font-size:14px;margin-top:4px">${a.data_nascimento||'—'}</div></div>
            <div><div class="form-label">Telefone</div><div style="font-size:14px;margin-top:4px">${a.telefone||'—'}</div></div>
            <div class="full"><div class="form-label">Turma</div><div style="font-size:14px;margin-top:4px">${a.turma_nome||'Sem turma'}</div></div>
            ${a.observacoes?`<div class="full"><div class="form-label">Observações</div><div style="font-size:14px;margin-top:4px;color:var(--text-secondary)">${a.observacoes}</div></div>`:''}
          </div>
        </div>
        <div class="tab-panel" id="det-nivel">
          <div style="margin-bottom:20px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <span style="font-size:13px;font-weight:600;color:var(--text-secondary)">PROGRESSO NO CURSO</span>
              <span style="font-family:'Sora',sans-serif;font-size:22px;font-weight:700;color:${NIVEL_CORES[a.nivel]}">${a.nivel}</span>
            </div>
            ${levelBar(a.nivel)}
          </div>
          ${a.anotacoes_prog?`<div style="background:var(--off-white);border-radius:var(--radius-sm);padding:16px;font-size:14px;color:var(--text-secondary);line-height:1.6">${a.anotacoes_prog}</div>`:'<div class="empty-state"><div class="empty-icon">📝</div><p>Sem anotações de progresso</p></div>'}
        </div>
        <div class="tab-panel" id="det-fin">
          <div class="form-grid">
            <div><div class="form-label">Plano</div><div style="font-size:14px;margin-top:4px">${a.plano_nome||'—'}</div></div>
            <div><div class="form-label">Valor</div><div style="font-family:'Sora',sans-serif;font-size:18px;font-weight:600;margin-top:4px">${a.plano_valor?'R$ '+parseFloat(a.plano_valor).toLocaleString('pt-BR'):'—'}</div></div>
            <div><div class="form-label">Forma de Pagamento</div><div style="font-size:14px;margin-top:4px">${a.forma_pgto||'—'}</div></div>
            <div><div class="form-label">Vencimento</div><div style="font-size:14px;margin-top:4px">Dia ${a.dia_vencimento||'—'}</div></div>
            <div class="full"><div class="form-label">Status</div><div style="margin-top:4px">${pgtoBadge(a.status_pgto)}</div></div>
          </div>
        </div>
      </div>`;
    navTo('detalheAluno');
  } catch(e) { showToast('Erro ao carregar aluno', 'error'); console.error(e); }
}

async function openModalAluno() {
  await preloadSelects();
  clearAlunoForm();
  document.getElementById('modalAlunoTitle').textContent = 'Novo Aluno';
  document.getElementById('alunoEditId').value = '';
  openModal('modalAluno');
}

async function editAluno(id) {
  try {
    const a = await DB.alunos.buscarPorId(id);
    await preloadSelects();
    document.getElementById('alunoEditId').value = a.id;
    document.getElementById('aNome').value       = a.nome;
    document.getElementById('aEmail').value      = a.email||'';
    document.getElementById('aTel').value        = a.telefone||'';
    document.getElementById('aNasc').value       = a.data_nascimento||'';
    document.getElementById('aMatricula').value  = a.data_matricula||'';
    document.getElementById('aStatus').value     = a.status;
    document.getElementById('aObs').value        = a.observacoes||'';
    document.getElementById('aNivel').value      = a.nivel;
    document.getElementById('aTurma').value      = a.turma_id||'';
    document.getElementById('aProgresso').value  = a.anotacoes_prog||'';
    document.getElementById('aPlano').value      = a.plano_id||'';
    document.getElementById('aPgto').value       = a.forma_pgto||'PIX';
    document.getElementById('aVenc').value       = a.dia_vencimento||'';
    document.getElementById('aPgtoStatus').value = a.status_pgto||'Em dia';
    document.getElementById('modalAlunoTitle').textContent = 'Editar Aluno';
    openModal('modalAluno');
  } catch(e) { showToast('Erro ao carregar dados do aluno', 'error'); console.error(e); }
}

async function saveAluno() {
  const nome = document.getElementById('aNome').value.trim();
  if (!nome) { showToast('Nome é obrigatório', 'error'); return; }
  const payload = {
    id:              document.getElementById('alunoEditId').value || null,
    nome,
    email:           document.getElementById('aEmail').value,
    telefone:        document.getElementById('aTel').value,
    data_nascimento: document.getElementById('aNasc').value,
    data_matricula:  document.getElementById('aMatricula').value,
    status:          document.getElementById('aStatus').value,
    observacoes:     document.getElementById('aObs').value,
    nivel:           document.getElementById('aNivel').value,
    turma_id:        document.getElementById('aTurma').value || null,
    anotacoes_prog:  document.getElementById('aProgresso').value,
    plano_id:        document.getElementById('aPlano').value || null,
    forma_pgto:      document.getElementById('aPgto').value,
    dia_vencimento:  document.getElementById('aVenc').value,
    status_pgto:     document.getElementById('aPgtoStatus').value,
  };
  try {
    await DB.alunos.salvar(payload);
    closeModal('modalAluno');
    renderAlunos();
    showToast('Aluno salvo com sucesso!', 'success');
  } catch(e) { showToast('Erro ao salvar aluno', 'error'); console.error(e); }
}

function clearAlunoForm() {
  ['aNome','aEmail','aTel','aNasc','aMatricula','aObs','aProgresso','aVenc'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('aStatus').value     = 'Ativo';
  document.getElementById('aNivel').value      = 'A1';
  document.getElementById('aPgto').value       = 'PIX';
  document.getElementById('aPgtoStatus').value = 'Em dia';
}

async function preloadSelects() {
  const [turmas, planos] = await Promise.all([DB.turmas.listar(), DB.planos.listar()]);
  document.getElementById('aTurma').innerHTML = '<option value="">Sem turma</option>' + turmas.map(t=>`<option value="${t.id}">${t.nome}</option>`).join('');
  document.getElementById('aPlano').innerHTML = '<option value="">Selecione</option>' + planos.map(p=>`<option value="${p.id}">${p.nome} — R$ ${parseFloat(p.valor).toLocaleString('pt-BR')}</option>`).join('');
}

// ── FINANCEIRO ──────────────────────────────────────────────
async function renderFinanceiro() {
  try {
    const alunos = await DB.alunos.listar();
    const planos = await DB.planos.listar();
    const planoMap = Object.fromEntries(planos.map(p=>[p.id, p]));
    const recConf = alunos.filter(a=>a.status_pgto==='Em dia').reduce((s,a)=>{const p=planoMap[a.plano_id]; return s+(p?parseFloat(p.valor):0);},0);
    const recEsp  = alunos.filter(a=>a.status==='Ativo').reduce((s,a)=>{const p=planoMap[a.plano_id]; return s+(p?parseFloat(p.valor):0);},0);
    document.getElementById('finReceita').textContent  = 'R$ ' + recConf.toLocaleString('pt-BR');
    document.getElementById('finEsperada').textContent = 'R$ ' + recEsp.toLocaleString('pt-BR');
    document.getElementById('finAtraso').textContent   = alunos.filter(a=>a.status_pgto==='Atrasado').length;
    document.getElementById('financeTable').innerHTML = `
      <thead><tr><th>Aluno</th><th>Plano</th><th>Valor</th><th>Vencimento</th><th>Forma Pgto</th><th>Status</th><th>Ação</th></tr></thead>
      <tbody>${alunos.map(a=>{
        const p = planoMap[a.plano_id];
        return `<tr>
          <td><b>${a.nome}</b></td>
          <td>${p?p.nome:'—'}</td>
          <td>${p?'R$ '+parseFloat(p.valor).toLocaleString('pt-BR'):'—'}</td>
          <td>Dia ${a.dia_vencimento||'—'}</td>
          <td>${a.forma_pgto||'—'}</td>
          <td>${pgtoBadge(a.status_pgto)}</td>
          <td><select class="form-select" style="font-size:12px;padding:5px 8px;width:auto" onchange="updatePgtoStatus('${a.id}',this.value)">
            <option${a.status_pgto==='Em dia'?' selected':''}>Em dia</option>
            <option${a.status_pgto==='Pendente'?' selected':''}>Pendente</option>
            <option${a.status_pgto==='Atrasado'?' selected':''}>Atrasado</option>
          </select></td>
        </tr>`;
      }).join('')}</tbody>`;
  } catch(e) { showToast('Erro ao carregar financeiro', 'error'); console.error(e); }
}

async function updatePgtoStatus(id, status) {
  try {
    await DB.alunos.atualizarPgtoStatus(id, status);
    showToast('Status atualizado!', 'success');
  } catch(e) { showToast('Erro ao atualizar', 'error'); }
}

// ── TURMAS ──────────────────────────────────────────────────
async function renderTurmas() {
  try {
    const [turmas, alunos] = await Promise.all([DB.turmas.listar(), DB.alunos.listar()]);
    document.getElementById('turmasGrid').innerHTML = turmas.length
      ? turmas.map(t => {
          const membros = alunos.filter(a => a.turma_id === t.id);
          return `<div class="turma-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div><div class="turma-name">${t.nome}</div>
                <div class="turma-info">${levelBadge(t.nivel)} &nbsp;${t.modalidade}<br>🕐 ${t.horario||'—'}</div>
              </div>
              <div style="display:flex;gap:6px">
                <button class="btn-icon" onclick="editTurma('${t.id}')">✏️</button>
                <button class="btn-icon" onclick="confirmDelete('turma','${t.id}')">🗑</button>
              </div>
            </div>
            ${membros.length
              ? `<div class="turma-alunos">${membros.map(a=>`<div class="turma-aluno-chip">${a.nome.split(' ')[0]}</div>`).join('')}</div>`
              : '<div style="margin-top:12px;font-size:12px;color:var(--text-muted)">Nenhum aluno nesta turma</div>'
            }
          </div>`;
        }).join('')
      : '<div class="empty-state"><div class="empty-icon">📚</div><p>Nenhuma turma cadastrada</p></div>';
  } catch(e) { showToast('Erro ao carregar turmas', 'error'); console.error(e); }
}

async function saveTurma() {
  const nome = document.getElementById('tNome').value.trim();
  if (!nome) { showToast('Nome é obrigatório', 'error'); return; }
  const id = document.getElementById('turmaEditId').value;
  const payload = { nome, nivel: document.getElementById('tNivel').value, horario: document.getElementById('tHorario').value, modalidade: document.getElementById('tModalidade').value, descricao: document.getElementById('tDesc').value };
  if (id) payload.id = id;
  try {
    await DB.turmas.salvar(payload);
    closeModal('modalTurma');
    document.getElementById('turmaEditId').value = '';
    document.getElementById('modalTurmaTitle').textContent = 'Nova Turma';
    ['tNome','tHorario','tDesc'].forEach(id => document.getElementById(id).value = '');
    renderTurmas();
    showToast('Turma salva!', 'success');
  } catch(e) { showToast('Erro ao salvar turma', 'error'); console.error(e); }
}

async function editTurma(id) {
  try {
    const turmas = await DB.turmas.listar();
    const t = turmas.find(x=>x.id===id);
    if (!t) return;
    document.getElementById('turmaEditId').value    = t.id;
    document.getElementById('tNome').value          = t.nome;
    document.getElementById('tNivel').value         = t.nivel;
    document.getElementById('tHorario').value       = t.horario||'';
    document.getElementById('tModalidade').value    = t.modalidade;
    document.getElementById('tDesc').value          = t.descricao||'';
    document.getElementById('modalTurmaTitle').textContent = 'Editar Turma';
    openModal('modalTurma');
  } catch(e) { showToast('Erro ao carregar turma', 'error'); }
}

// ── BIBLIOTECA ──────────────────────────────────────────────
async function renderMateriais() {
  const q  = document.getElementById('searchMat')?.value       || '';
  const fn = document.getElementById('filterMatNivel')?.value  || '';
  const ft = document.getElementById('filterMatTipo')?.value   || '';
  try {
    let mats;
    if (currentUser.role === 'aluno') {
      mats = await DB.materiais.listarParaAluno(currentUser.alunoNivel);
    } else {
      mats = await DB.materiais.listar({ busca: q, nivel: fn, tipo: ft });
    }
    const icons = { PDF:'📄', 'Vídeo':'🎬', Link:'🔗', Áudio:'🎧' };
    const clss  = { PDF:'mat-pdf', 'Vídeo':'mat-video', Link:'mat-link', Áudio:'mat-audio' };
    const targetId = currentUser.role === 'aluno' ? 'portalMateriais' : 'materiaisGrid';
    const target   = document.getElementById(targetId);
    if (!target) return;
    target.innerHTML = mats.length
      ? mats.map(m=>`<div class="material-card">
          <div class="material-type-icon ${clss[m.tipo]||''}">${icons[m.tipo]||'📄'}</div>
          <div class="material-name">${m.titulo}</div>
          <div class="material-meta">${m.tema} · <span style="color:${NIVEL_CORES[m.nivel]||'#64748B'};font-weight:600">${m.nivel}</span></div>
          ${m.descricao?`<div style="font-size:12px;color:var(--text-muted);margin-top:6px;line-height:1.5">${m.descricao}</div>`:''}
          <div class="material-actions">
            <a href="${m.link_url}" target="_blank" class="btn btn-sm btn-primary">Abrir ↗</a>
            ${currentUser.role==='professor'?`<button class="btn btn-sm btn-secondary" onclick="editMaterial('${m.id}')">✏️</button><button class="btn btn-sm btn-danger" onclick="confirmDelete('material','${m.id}')">🗑</button>`:''}
          </div>
        </div>`).join('')
      : '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">📁</div><p>Nenhum material encontrado</p></div>';
  } catch(e) { showToast('Erro ao carregar materiais', 'error'); console.error(e); }
}

async function saveMaterial() {
  const titulo   = document.getElementById('mTitulo').value.trim();
  const link_url = document.getElementById('mLink').value.trim();
  if (!titulo||!link_url) { showToast('Título e link são obrigatórios', 'error'); return; }
  const id = document.getElementById('matEditId').value;
  const payload = { titulo, tipo: document.getElementById('mTipo').value, nivel: document.getElementById('mNivel').value, tema: document.getElementById('mTema').value, link_url, descricao: document.getElementById('mDesc').value };
  if (id) payload.id = id;
  try {
    await DB.materiais.salvar(payload);
    closeModal('modalMaterial');
    document.getElementById('matEditId').value = '';
    document.getElementById('modalMaterialTitle').textContent = 'Novo Material';
    ['mTitulo','mLink','mDesc'].forEach(id => document.getElementById(id).value = '');
    renderMateriais();
    showToast('Material salvo!', 'success');
  } catch(e) { showToast('Erro ao salvar material', 'error'); console.error(e); }
}

async function editMaterial(id) {
  try {
    const mats = await DB.materiais.listar();
    const m = mats.find(x=>x.id===id);
    if (!m) return;
    document.getElementById('matEditId').value = m.id;
    document.getElementById('mTitulo').value   = m.titulo;
    document.getElementById('mTipo').value     = m.tipo;
    document.getElementById('mNivel').value    = m.nivel;
    document.getElementById('mTema').value     = m.tema;
    document.getElementById('mLink').value     = m.link_url;
    document.getElementById('mDesc').value     = m.descricao||'';
    document.getElementById('modalMaterialTitle').textContent = 'Editar Material';
    openModal('modalMaterial');
  } catch(e) { showToast('Erro ao carregar material', 'error'); }
}

// ── CONFIG ──────────────────────────────────────────────────
async function renderConfig() {
  try {
    const planos = await DB.planos.listar();
    document.getElementById('planosLista').innerHTML = planos.length
      ? planos.map(p=>`<div class="finance-row">
          <div><div class="finance-name">${p.nome}</div><div class="finance-plan">${p.frequencia} · ${p.descricao||''}</div></div>
          <div style="display:flex;align-items:center;gap:12px">
            <div class="finance-amount">R$ ${parseFloat(p.valor).toLocaleString('pt-BR')}</div>
            <div style="display:flex;gap:6px">
              <button class="btn-icon" onclick="editPlano('${p.id}')">✏️</button>
              <button class="btn-icon" onclick="confirmDelete('plano','${p.id}')">🗑</button>
            </div>
          </div>
        </div>`).join('')
      : '<div class="empty-state"><div class="empty-icon">💳</div><p>Nenhum plano cadastrado</p></div>';
    await renderAcessos();
  } catch(e) { showToast('Erro ao carregar configurações', 'error'); }
}

// ── ACESSO DOS ALUNOS ────────────────────────────────────────
async function renderAcessos() {
  try {
    const alunos = await DB.alunos.listar();
    const tbl = document.getElementById('acessosTable');
    if (!tbl) return;
    tbl.innerHTML = alunos.length ? `
      <thead><tr><th>Aluno</th><th>Código</th><th>Status</th><th>Acesso</th><th>Ação</th></tr></thead>
      <tbody>${alunos.map(a => `<tr>
        <td><b>${a.nome}</b></td>
        <td><code style="font-size:12px;background:var(--off-white);padding:2px 6px;border-radius:4px">${a.codigo}</code></td>
        <td>${statusBadge(a.status)}</td>
        <td>${a.codigo_acesso ? '<span class="badge badge-success">Habilitado</span>' : '<span class="badge badge-danger">Bloqueado</span>'}</td>
        <td><button class="btn btn-sm btn-secondary" onclick="abrirGerenciarAcesso('${a.id}','${a.nome}','${a.codigo}',${!!a.codigo_acesso})">🔑 Gerenciar</button></td>
      </tr>`).join('')}</tbody>` : '<tr><td><div class="empty-state"><div class="empty-icon">🔑</div><p>Nenhum aluno cadastrado</p></div></td></tr>';
  } catch(e) { showToast('Erro ao carregar acessos', 'error'); }
}

function abrirGerenciarAcesso(id, nome, codigo, temAcesso) {
  document.getElementById('acessoAlunoId').value = id;
  document.getElementById('acessoAlunoNome').textContent = nome;
  document.getElementById('acessoAlunoCodigo').textContent = 'Código: ' + codigo;
  document.getElementById('acessoSenha').value = '';
  document.getElementById('acessoStatusAtual').innerHTML = temAcesso
    ? `<span class="badge badge-success">Acesso habilitado</span>`
    : `<span class="badge badge-danger">Acesso bloqueado</span>`;
  document.getElementById('btnRemoverAcesso').style.display = temAcesso ? 'inline-flex' : 'none';
  openModal('modalAcesso');
}

function gerarSenhaAleatoria() {
  document.getElementById('acessoSenha').value = String(Math.floor(100000 + Math.random()*900000));
}

async function salvarAcesso() {
  const id    = document.getElementById('acessoAlunoId').value;
  const senha = document.getElementById('acessoSenha').value.trim();
  if (!/^\d{6}$/.test(senha)) { showToast('A senha deve ter exatamente 6 dígitos numéricos.', 'error'); return; }
  try {
    await DB.alunos.definirAcesso(id, senha);
    closeModal('modalAcesso');
    await renderAcessos();
    showToast('Acesso habilitado com sucesso! Informe a senha ao aluno.', 'success');
  } catch(e) { showToast('Erro ao salvar acesso', 'error'); console.error(e); }
}

async function removerAcesso() {
  const id = document.getElementById('acessoAlunoId').value;
  try {
    await DB.alunos.removerAcesso(id);
    closeModal('modalAcesso');
    await renderAcessos();
    showToast('Acesso removido.', 'success');
  } catch(e) { showToast('Erro ao remover acesso', 'error'); console.error(e); }
}

async function savePlano() {
  const nome  = document.getElementById('pNome').value.trim();
  const valor = document.getElementById('pValor').value;
  if (!nome||!valor) { showToast('Nome e valor são obrigatórios', 'error'); return; }
  const id = document.getElementById('planoEditId').value;
  const payload = { nome, valor: parseFloat(valor), frequencia: document.getElementById('pFreq').value, descricao: document.getElementById('pDesc').value };
  if (id) payload.id = id;
  try {
    await DB.planos.salvar(payload);
    closeModal('modalPlano');
    document.getElementById('planoEditId').value = '';
    ['pNome','pValor','pDesc'].forEach(id => document.getElementById(id).value = '');
    renderConfig();
    showToast('Plano salvo!', 'success');
  } catch(e) { showToast('Erro ao salvar plano', 'error'); console.error(e); }
}

async function editPlano(id) {
  try {
    const planos = await DB.planos.listar();
    const p = planos.find(x=>x.id===id);
    if (!p) return;
    document.getElementById('planoEditId').value = p.id;
    document.getElementById('pNome').value       = p.nome;
    document.getElementById('pValor').value      = p.valor;
    document.getElementById('pFreq').value       = p.frequencia;
    document.getElementById('pDesc').value       = p.descricao||'';
    openModal('modalPlano');
  } catch(e) { showToast('Erro ao carregar plano', 'error'); }
}

async function changePass() {
  const np = document.getElementById('newPass').value;
  const cp = document.getElementById('confPass').value;
  if (!np) { showToast('Digite a nova senha', 'error'); return; }
  if (np !== cp) { showToast('As senhas não coincidem', 'error'); return; }
  try {
    await DB.config.set('prof_pass_hash', np);
    document.getElementById('newPass').value = '';
    document.getElementById('confPass').value = '';
    showToast('Senha alterada com sucesso!', 'success');
  } catch(e) { showToast('Erro ao alterar senha', 'error'); }
}

// ── PORTAL ALUNO ────────────────────────────────────────────
async function renderPortal() {
  try {
    const a = await DB.alunos.buscarPorId(currentUser.alunoId);
    document.getElementById('portalWelcome').textContent = `Olá, ${a.nome.split(' ')[0]}! 👋`;
    document.getElementById('portalSub').textContent     = `Código: ${a.codigo} · Nível: ${a.nivel}`;
    document.getElementById('portalNivel').innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <span style="font-size:14px;color:var(--text-secondary)">Seu progresso no curso</span>
        <span style="font-family:'Sora',sans-serif;font-size:24px;font-weight:700;color:${NIVEL_CORES[a.nivel]}">${a.nivel}</span>
      </div>
      ${levelBar(a.nivel)}
      ${a.anotacoes_prog?`<div style="margin-top:16px;padding:12px;background:var(--off-white);border-radius:var(--radius-sm);font-size:13px;color:var(--text-secondary);line-height:1.5">${a.anotacoes_prog}</div>`:''}`;
    document.getElementById('portalTurma').innerHTML = a.turma_nome
      ? `<div class="turma-name" style="font-size:16px">${a.turma_nome}</div>
         <div class="turma-info">${levelBadge(a.nivel)} &nbsp;${a.turma_horario||''}</div>`
      : '<div class="empty-state"><p>Sem turma atribuída</p></div>';
    await renderMateriais();
  } catch(e) { showToast('Erro ao carregar painel', 'error'); console.error(e); }
}

// ── DELETE ──────────────────────────────────────────────────
function confirmDelete(type, id) {
  const msgs = { aluno:'Excluir este aluno? Ação irreversível.', turma:'Excluir esta turma?', material:'Excluir este material?', plano:'Excluir este plano?' };
  document.getElementById('confirmMsg').textContent = msgs[type]||'Confirmar exclusão?';
  document.getElementById('confirmBtn').onclick = () => doDelete(type, id);
  openModal('modalConfirm');
}

async function doDelete(type, id) {
  const fns = { aluno: DB.alunos.excluir, turma: DB.turmas.excluir, material: DB.materiais.excluir, plano: DB.planos.excluir };
  try {
    await fns[type](id);
    closeModal('modalConfirm');
    const renders = { aluno: renderAlunos, turma: renderTurmas, material: renderMateriais, plano: renderConfig };
    if (renders[type]) renders[type]();
    showToast('Item excluído.', 'success');
  } catch(e) { showToast('Erro ao excluir', 'error'); console.error(e); }
}
