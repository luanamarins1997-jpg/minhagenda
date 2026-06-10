-- ============================================
-- Supabase Setup - Minha Agenda v2 (Escrita Manual)
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de tarefas (design simplificado)
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_date DATE NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('manha', 'tarde', 'noite')),
  drawing TEXT DEFAULT '',
  title TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seguranca: cada usuario ve apenas suas tarefas
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios podem ver suas tarefas"
  ON tasks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem criar tarefas"
  ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios podem atualizar tarefas"
  ON tasks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem excluir tarefas"
  ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Remove tabelas antigas se existirem
DROP TABLE IF EXISTS events CASCADE;
