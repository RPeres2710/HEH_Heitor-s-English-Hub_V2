// ============================================================
//  HEITOR'S ENGLISH HUB — Configuração Supabase
// ============================================================

const SUPABASE_URL  = 'https://bzyejmneuzitgxsehpfa.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6eWVqbW5ldXppdGd4c2VocGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3Mzk3ODksImV4cCI6MjA5ODMxNTc4OX0.sQXUNH3tcq-KjuYB_74f4HuTQ5NztF7o3BDYdQfUi60';

// Não altere abaixo desta linha
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
