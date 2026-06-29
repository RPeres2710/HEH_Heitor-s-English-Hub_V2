# Heitor's English Hub 🇬🇧

Sistema de gestão acadêmica para professores de inglês particular.

## Estrutura do projeto

```
heiters-english-hub/
├── index.html          # App principal
├── css/
│   └── style.css       # Estilos
├── js/
│   ├── config.js       # ⚠️ SUAS CREDENCIAIS AQUI
│   ├── db.js           # Camada de dados (Supabase)
│   └── app.js          # Lógica e renderização
├── supabase/
│   └── schema.sql      # Schema do banco de dados
└── README.md
```

---

## 1. Configurar o Supabase

### 1.1 Execute o schema
No painel do Supabase, vá em **SQL Editor** e execute o arquivo `supabase/schema.sql`.

### 1.2 Pegue suas credenciais
Vá em **Project Settings → API** e copie:
- **Project URL** → `https://SEU-ID.supabase.co`
- **anon public key**

### 1.3 Cole em `js/config.js`
```js
const SUPABASE_URL  = 'https://SEU-ID.supabase.co';
const SUPABASE_ANON = 'SUA-ANON-KEY';
```

---

## 2. Publicar no GitHub Pages

```bash
# 1. Crie o repositório no GitHub (pode ser público ou privado)
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/heiters-english-hub.git
git push -u origin main

# 2. No GitHub: Settings → Pages → Branch: main → Save
# 3. Acesse: https://SEU-USUARIO.github.io/heiters-english-hub
```

---

## 3. Primeiro acesso

| Perfil | Campo | Valor padrão |
|--------|-------|-------------|
| Professor | Senha | `heitor123` *(altere em Configurações)* |
| Aluno | Código de matrícula | Gerado automaticamente ao cadastrar |

---

## Funcionalidades

### Professor (Admin)
- ✅ Dashboard com métricas e alertas
- ✅ Cadastro completo de alunos (matrícula, progresso, financeiro)
- ✅ Controle financeiro com status de pagamento
- ✅ Gestão de turmas
- ✅ Biblioteca de materiais (PDF, Vídeo, Link, Áudio)
- ✅ Configuração de planos e senha

### Aluno (Portal)
- ✅ Visualização do próprio progresso com barra A1→C2
- ✅ Informações da turma e horário
- ✅ Acesso aos materiais do seu nível

---

## Tecnologias

- **Frontend:** HTML + CSS + JavaScript puro (sem framework)
- **Backend:** [Supabase](https://supabase.com) (PostgreSQL + API REST)
- **Hospedagem:** GitHub Pages (gratuito)
- **Fontes:** Google Fonts (Sora + Inter)
