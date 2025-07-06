/*
  # Criação da tabela de perfis de usuários

  1. Nova Tabela
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key para auth.users)
      - `nome` (text)
      - `objetivo` (text)
      - `experiencia` (text)
      - `frequencia` (text)
      - `limitacoes` (jsonb array)
      - `preferencia` (text)
      - `peso` (numeric)
      - `altura` (numeric)
      - `idade` (integer)
      - `onboarding_completed` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Segurança
    - Enable RLS na tabela `user_profiles`
    - Política para usuários autenticados lerem/editarem apenas seus próprios dados
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  nome text,
  objetivo text,
  experiencia text,
  frequencia text,
  limitacoes jsonb DEFAULT '[]'::jsonb,
  preferencia text,
  peso numeric,
  altura numeric,
  idade integer,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON user_profiles(onboarding_completed);