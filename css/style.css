/* ============================================================
   HEITOR'S ENGLISH HUB — Estilos principais
   ============================================================ */

:root {
  --navy: #0F1F3D;
  --navy-mid: #162840;
  --navy-light: #1E3A5F;
  --amber: #F5A623;
  --amber-light: #FFC85A;
  --amber-dim: rgba(245,166,35,0.15);
  --white: #FFFFFF;
  --off-white: #F7F9FC;
  --text-primary: #0F1F3D;
  --text-secondary: #5A6A80;
  --text-muted: #9AA5B4;
  --border: #E2E8F0;
  --border-dark: #CBD5E1;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #3B82F6;
  --card-bg: #FFFFFF;
  --sidebar-w: 240px;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 1px 3px rgba(15,31,61,0.08), 0 4px 16px rgba(15,31,61,0.06);
  --shadow-md: 0 4px 24px rgba(15,31,61,0.12);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', sans-serif;
  background: var(--off-white);
  color: var(--text-primary);
  min-height: 100vh;
}

/* ── LOGIN ── */
#loginScreen {
  min-height: 100vh;
  background: var(--navy);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
#loginScreen::before {
  content: '';
  position: absolute;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%);
  top: -100px; right: -100px;
  pointer-events: none;
}
.login-box {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  padding: 48px 44px;
  width: 420px;
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;
}
.login-logo { text-align: center; margin-bottom: 36px; }
.hub-mark {
  width: 56px; height: 56px;
  background: var(--amber);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: var(--navy);
}
.login-logo h1 { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 600; color: var(--white); }
.login-logo p { font-size: 13px; color: rgba(255,255,255,0.45); margin-top: 4px; }
.login-tabs {
  display: flex;
  background: rgba(255,255,255,0.06);
  border-radius: var(--radius-sm);
  padding: 4px;
  margin-bottom: 28px;
  gap: 4px;
}
.login-tab {
  flex: 1; padding: 10px; border: none;
  background: transparent; color: rgba(255,255,255,0.5);
  font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
  border-radius: 6px; cursor: pointer; transition: all 0.2s;
}
.login-tab.active { background: var(--amber); color: var(--navy); font-weight: 600; }
.login-panel { display: none; }
.login-panel.active { display: block; }
.login-label {
  display: block; font-size: 12px; font-weight: 500;
  color: rgba(255,255,255,0.5); letter-spacing: 0.5px;
  text-transform: uppercase; margin-bottom: 8px;
}
.login-input {
  width: 100%; padding: 13px 16px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-sm);
  color: var(--white); font-family: 'Inter', sans-serif;
  font-size: 15px; outline: none; transition: border-color 0.2s; margin-bottom: 20px;
}
.login-input:focus { border-color: var(--amber); }
.login-input::placeholder { color: rgba(255,255,255,0.25); }
.login-btn {
  width: 100%; padding: 14px; background: var(--amber);
  border: none; border-radius: var(--radius-sm);
  color: var(--navy); font-family: 'Sora', sans-serif;
  font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.login-btn:hover { background: var(--amber-light); transform: translateY(-1px); }
.login-error { color: #FF6B6B; font-size: 13px; margin-top: 12px; text-align: center; display: none; }
.login-loading { color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 12px; text-align: center; display: none; }

/* ── LAYOUT ── */
#appScreen { display: none; min-height: 100vh; }
.app-layout { display: flex; min-height: 100vh; }

/* SIDEBAR */
.sidebar {
  width: var(--sidebar-w);
  background: var(--navy);
  display: flex; flex-direction: column;
  position: fixed; top: 0; left: 0; bottom: 0;
  z-index: 100; overflow-y: auto;
}
.sidebar-header { padding: 24px 20px 20px; border-bottom: 1px solid rgba(255,255,255,0.07); }
.sidebar-brand { display: flex; align-items: center; gap: 12px; }
.brand-mark {
  width: 36px; height: 36px; background: var(--amber);
  border-radius: 9px; display: flex; align-items: center; justify-content: center;
  font-family: 'Sora', sans-serif; font-weight: 700; font-size: 14px;
  color: var(--navy); flex-shrink: 0;
}
.brand-name { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--white); line-height: 1.3; }
.brand-sub { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 400; }
.sidebar-user { padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.07); }
.user-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--amber-dim); border: 1px solid rgba(245,166,35,0.3);
  border-radius: 20px; padding: 5px 12px;
  font-size: 11px; font-weight: 600; color: var(--amber);
  text-transform: uppercase; letter-spacing: 0.5px;
}
.user-badge .dot { width: 6px; height: 6px; background: var(--amber); border-radius: 50%; }
.sidebar-nav { flex: 1; padding: 16px 12px; }
.nav-section-label {
  font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.25);
  text-transform: uppercase; letter-spacing: 1px;
  padding: 0 8px; margin: 16px 0 6px;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: var(--radius-sm);
  color: rgba(255,255,255,0.55); font-size: 13.5px; font-weight: 500;
  cursor: pointer; transition: all 0.15s; margin-bottom: 2px;
  border: none; background: transparent; width: 100%; text-align: left;
}
.nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
.nav-item.active { background: var(--amber-dim); color: var(--amber); }
.nav-item .nav-icon { font-size: 16px; width: 20px; text-align: center; }
.sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.07); }
.logout-btn {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: var(--radius-sm);
  color: rgba(255,255,255,0.4); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.15s; border: none; background: transparent; width: 100%;
}
.logout-btn:hover { color: #FF6B6B; background: rgba(255,107,107,0.08); }

/* MAIN */
.main-content { margin-left: var(--sidebar-w); flex: 1; min-height: 100vh; display: flex; flex-direction: column; }
.topbar {
  background: var(--white); border-bottom: 1px solid var(--border);
  padding: 0 32px; height: 64px; display: flex; align-items: center;
  justify-content: space-between; position: sticky; top: 0; z-index: 50;
}
.topbar-title { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 600; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-date { font-size: 13px; color: var(--text-muted); }
.page-body { padding: 28px 32px; flex: 1; }

/* CARDS */
.card { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.card-header { padding: 20px 24px 0; display: flex; align-items: center; justify-content: space-between; }
.card-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; }
.card-body { padding: 20px 24px; }

/* STAT CARDS */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 20px 22px;
  box-shadow: var(--shadow); position: relative; overflow: hidden;
}
.stat-card::after {
  content: ''; position: absolute; top: 0; left: 0;
  width: 3px; height: 100%; background: var(--amber);
  border-radius: 3px 0 0 3px;
}
.stat-card.success::after { background: var(--success); }
.stat-card.danger::after { background: var(--danger); }
.stat-card.info::after { background: var(--info); }
.stat-label { font-size: 12px; font-weight: 500; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.stat-value { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 700; line-height: 1; margin-bottom: 6px; }
.stat-sub { font-size: 12px; color: var(--text-muted); }

/* LEVEL BAR */
.level-track { display: flex; gap: 4px; align-items: center; }
.level-seg { flex: 1; height: 6px; border-radius: 3px; background: var(--border); transition: background 0.3s; }
.level-seg.filled.a1 { background: #94A3B8; }
.level-seg.filled.a2 { background: #64748B; }
.level-seg.filled.b1 { background: #3B82F6; }
.level-seg.filled.b2 { background: #8B5CF6; }
.level-seg.filled.c1 { background: #F59E0B; }
.level-seg.filled.c2 { background: #10B981; }
.level-labels { display: flex; justify-content: space-between; margin-top: 4px; }
.level-label-item { font-size: 10px; font-weight: 600; color: var(--text-muted); flex: 1; text-align: center; }
.level-label-item.current { color: var(--amber); }

/* BADGES */
.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
.badge-success { background: rgba(16,185,129,0.1); color: var(--success); }
.badge-warning { background: rgba(245,158,11,0.1); color: var(--warning); }
.badge-danger  { background: rgba(239,68,68,0.1);  color: var(--danger); }
.badge-info    { background: rgba(59,130,246,0.1);  color: var(--info); }
.badge-navy    { background: rgba(15,31,61,0.08);   color: var(--navy); }

/* BUTTONS */
.btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: var(--radius-sm); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; text-decoration: none; }
.btn-primary { background: var(--amber); color: var(--navy); }
.btn-primary:hover { background: var(--amber-light); transform: translateY(-1px); }
.btn-secondary { background: var(--off-white); color: var(--text-primary); border: 1px solid var(--border); }
.btn-secondary:hover { background: var(--border); }
.btn-danger { background: rgba(239,68,68,0.1); color: var(--danger); }
.btn-danger:hover { background: rgba(239,68,68,0.2); }
.btn-sm { padding: 6px 12px; font-size: 12px; }
.btn-icon { padding: 8px; border-radius: var(--radius-sm); background: var(--off-white); border: 1px solid var(--border); cursor: pointer; font-size: 15px; transition: all 0.15s; }
.btn-icon:hover { background: var(--border); }

/* TABLE */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
thead th { padding: 11px 16px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border); background: var(--off-white); }
tbody td { padding: 14px 16px; font-size: 13.5px; border-bottom: 1px solid var(--border); vertical-align: middle; }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover { background: var(--off-white); }

/* FORM */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: 1 / -1; }
.form-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.4px; }
.form-input, .form-select, .form-textarea { padding: 10px 14px; border: 1px solid var(--border-dark); border-radius: var(--radius-sm); font-family: 'Inter', sans-serif; font-size: 14px; color: var(--text-primary); background: var(--white); outline: none; transition: border-color 0.2s; }
.form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--amber); box-shadow: 0 0 0 3px var(--amber-dim); }
.form-textarea { resize: vertical; min-height: 80px; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(15,31,61,0.55); backdrop-filter: blur(4px); z-index: 200; display: none; align-items: center; justify-content: center; }
.modal-overlay.open { display: flex; }
.modal { background: var(--white); border-radius: 16px; width: 580px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-md); }
.modal-header { padding: 24px 28px 0; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.modal-title { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 600; }
.modal-close { background: none; border: none; font-size: 22px; cursor: pointer; color: var(--text-muted); padding: 4px; border-radius: 6px; transition: all 0.15s; }
.modal-close:hover { background: var(--off-white); }
.modal-body { padding: 0 28px 28px; }
.modal-footer { padding: 0 28px 24px; display: flex; gap: 10px; justify-content: flex-end; }

/* TABS */
.tabs { display: flex; gap: 4px; border-bottom: 2px solid var(--border); margin-bottom: 20px; }
.tab-btn { padding: 10px 18px; font-size: 13px; font-weight: 500; color: var(--text-muted); border: none; background: transparent; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.15s; border-radius: 4px 4px 0 0; }
.tab-btn:hover { color: var(--text-primary); background: var(--off-white); }
.tab-btn.active { color: var(--amber); border-bottom-color: var(--amber); font-weight: 600; }
.tab-panel { display: none; }
.tab-panel.active { display: block; }

/* SEARCH */
.search-row { display: flex; gap: 12px; margin-bottom: 20px; align-items: center; }
.search-input-wrap { position: relative; flex: 1; }
.search-input-wrap input { width: 100%; padding: 10px 14px 10px 38px; border: 1px solid var(--border-dark); border-radius: var(--radius-sm); font-size: 14px; outline: none; transition: border-color 0.2s; font-family: 'Inter', sans-serif; }
.search-input-wrap input:focus { border-color: var(--amber); }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 15px; }

/* MATERIAL CARD */
.material-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.material-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; box-shadow: var(--shadow); transition: all 0.2s; }
.material-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.material-type-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 12px; }
.mat-pdf   { background: rgba(239,68,68,0.1); }
.mat-video { background: rgba(59,130,246,0.1); }
.mat-link  { background: rgba(16,185,129,0.1); }
.mat-audio { background: rgba(139,92,246,0.1); }
.material-name { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.material-meta { font-size: 12px; color: var(--text-muted); }
.material-actions { display: flex; gap: 8px; margin-top: 14px; }

/* TURMA CARD */
.turma-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.turma-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 22px; box-shadow: var(--shadow); }
.turma-name { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; margin-bottom: 6px; }
.turma-info { font-size: 13px; color: var(--text-muted); line-height: 1.7; }
.turma-alunos { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); display: flex; gap: 6px; flex-wrap: wrap; }
.turma-aluno-chip { padding: 4px 10px; background: var(--off-white); border: 1px solid var(--border); border-radius: 20px; font-size: 11px; font-weight: 500; }

/* CHART */
.chart-bar-wrap { display: flex; flex-direction: column; gap: 10px; }
.chart-bar-row { display: flex; align-items: center; gap: 12px; }
.chart-bar-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); width: 32px; text-align: right; }
.chart-bar-track { flex: 1; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
.chart-bar-fill { height: 100%; border-radius: 4px; transition: width 0.8s ease; }
.chart-bar-count { font-size: 12px; color: var(--text-muted); width: 24px; }

/* ALERTS */
.alert-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 10px; font-size: 13.5px; }
.alert-warning { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); color: #92400E; }
.alert-danger  { background: rgba(239,68,68,0.08);  border: 1px solid rgba(239,68,68,0.2);  color: #991B1B; }

/* DETAIL */
.detail-header { display: flex; align-items: center; gap: 20px; padding: 24px; background: var(--navy); border-radius: var(--radius) var(--radius) 0 0; color: var(--white); }
.detail-avatar { width: 56px; height: 56px; background: var(--amber); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; font-weight: 700; font-size: 20px; color: var(--navy); flex-shrink: 0; }
.detail-name { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 600; }
.detail-meta { font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 3px; }

/* FINANCE */
.finance-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border); }
.finance-row:last-child { border-bottom: none; }
.finance-name { font-size: 14px; font-weight: 500; }
.finance-plan { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.finance-amount { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; }

/* PORTAL ALUNO */
.portal-header { background: var(--navy); padding: 24px 32px; color: var(--white); margin: -28px -32px 28px; }
.portal-welcome { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 600; }
.portal-sub { font-size: 14px; color: rgba(255,255,255,0.5); margin-top: 4px; }

/* UTILS */
.page { display: none; }
.page.active { display: block; }
.empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
.empty-icon { font-size: 40px; margin-bottom: 12px; }
.divider { height: 1px; background: var(--border); margin: 20px 0; }
.toast { position: fixed; bottom: 24px; right: 24px; background: var(--navy); color: var(--white); padding: 12px 20px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; z-index: 999; box-shadow: var(--shadow-md); display: none; align-items: center; gap: 10px; }
.toast.show { display: flex; }
.toast.success { border-left: 3px solid var(--success); }
.toast.error   { border-left: 3px solid var(--danger); }
.spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .sidebar { transform: translateX(-100%); }
  .main-content { margin-left: 0; }
}
