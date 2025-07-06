import { supabase } from './supabaseClient'

class AuthService {
  async register(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined // Desabilita confirmação por email
        }
      })

      if (error) throw error

      return data.user
    } catch (error) {
      console.error('Erro no registro:', error)
      throw new Error(error.message || 'Erro ao criar conta')
    }
  }

  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return data.user
    } catch (error) {
      console.error('Erro no login:', error)
      throw new Error(error.message || 'Erro ao fazer login')
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Limpar dados locais
      localStorage.clear()
    } catch (error) {
      console.error('Erro no logout:', error)
      throw new Error(error.message || 'Erro ao fazer logout')
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      // Se erro for relacionado a sessão faltando, é normal (usuário não logado)
      if (error && error.name === 'AuthSessionMissingError') {
        return null
      }
      
      if (error) throw error
      
      return user
    } catch (error) {
      // Log apenas se não for erro de sessão faltando
      if (error.name !== 'AuthSessionMissingError') {
        console.error('Erro ao obter usuário atual:', error)
      }
      return null
    }
  }

  async saveUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) throw error

      return data[0]
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      throw new Error(error.message || 'Erro ao salvar perfil')
    }
  }

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = row not found
        throw error
      }

      return data
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      return null
    }
  }
}

export const authService = new AuthService()