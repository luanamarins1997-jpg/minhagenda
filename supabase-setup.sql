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

-- Caso ja tenha criado antes: remove NOT NULL do title
ALTER TABLE tasks ALTER COLUMN title DROP NOT NULL;
ALTER TABLE tasks ALTER COLUMN title SET DEFAULT '';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '';

-- Tabela de compromissos (um por dia)
CREATE TABLE IF NOT EXISTS commitments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  commit_date DATE NOT NULL UNIQUE,
  drawing TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios podem ver compromissos" ON commitments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios podem criar compromissos" ON commitments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios podem atualizar compromissos" ON commitments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuarios podem excluir compromissos" ON commitments FOR DELETE USING (auth.uid() = user_id);
