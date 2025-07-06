# 🔥 Maito Guy Fit - Chat de Fitness com IA

Um aplicativo web PWA que simula conversas com Maito Guy de Naruto como coach virtual de musculação e calistenia.

## 🎯 Funcionalidades

- **Autenticação segura** com Supabase
- **Onboarding completo** para coleta de dados do usuário
- **Chat em tempo real** com IA personalizada
- **Interface responsiva** otimizada para mobile
- **Tema escuro** nas cores características do Maito Guy
- **Persistência de sessão** e histórico de conversas

## 🛡️ Segurança Implementada

### ✅ Proteção de Dados
- API keys protegidas no backend
- Proxy server para webhook N8N
- Validação e sanitização de entrada
- Headers de segurança configurados
- Rate limiting implementado
- RLS (Row Level Security) no Supabase

### ✅ Autenticação
- JWT tokens seguros via Supabase
- Persistência de sessão
- Logout seguro com limpeza de dados

### ✅ Validação de Entrada
- Sanitização de mensagens do chat
- Validação de tipos de dados
- Proteção contra XSS e injection

## 🚀 Configuração e Deploy

### 1. Configuração do Ambiente

```bash
# Clone o repositório
git clone https://github.com/klaus-deor/maito-guy-fit.git
cd maito-guy-fit

# Instale as dependências
npm install
```

### 2. Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute a migration SQL em `supabase/migrations/create_user_profiles.sql`
3. Copie as credenciais para o arquivo `.env`

### 3. Configuração das Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas credenciais:
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
VITE_API_URL=http://localhost:3001
N8N_WEBHOOK_URL=https://sua-instancia-n8n.com/webhook/maito-guy
```

### 4. Configuração do N8N

Crie um workflow no N8N que:
1. Receba dados via webhook
2. Processe através do Flowise/IA
3. Retorne resposta no formato:
```json
{
  "message": "🔥 JUVENTUDE! Sua resposta aqui..."
}
```

### 5. Executar em Desenvolvimento

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### 6. Build para Produção

```bash
npm run build
```

## 📱 Como Usar

1. **Cadastro/Login:** Crie uma conta ou faça login
2. **Onboarding:** Complete o questionário inicial
3. **Chat:** Converse com o Maito Guy sobre fitness
4. **Perfil:** Edite seus dados quando necessário

## 🎨 Paleta de Cores

- **Verde Escuro:** `#1a4c2e` (Primária)
- **Verde Muito Escuro:** `#0f3c1f` (Variações)
- **Preto/Cinza Escuro:** `#000000` / `#1a1a1a` (Backgrounds)
- **Vermelho Escuro:** `#8b0000` (Acentos e alertas)

## 🔧 Tecnologias Utilizadas

### Frontend
- React 18
- React Router DOM
- Axios
- Lucide React (ícones)
- CSS3 com variáveis customizadas

### Backend
- Node.js + Express
- Helmet (segurança)
- CORS configurado
- Rate limiting personalizado

### Banco de Dados
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Autenticação JWT

### Deploy
- Frontend: Vercel/Netlify
- Backend: Railway/Heroku
- Database: Supabase (cloud)

## 🚨 Importante - Segurança

⚠️ **NUNCA commite o arquivo `.env`** - ele contém credenciais sensíveis

⚠️ **Configure CORS adequadamente** para produção

⚠️ **Use HTTPS** em produção obrigatoriamente

⚠️ **Monitore rate limits** e logs de segurança

## 📞 Suporte

Para dúvidas sobre configuração ou problemas de segurança, consulte:
- Documentação do Supabase
- Documentação do N8N
- Issues do repositório

---

**🔥 Desperte suas chamas da juventude! 💪**