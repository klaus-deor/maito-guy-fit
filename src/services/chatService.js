import axios from 'axios'

class ChatService {
  constructor() {
    // Conecta DIRETO no seu N8N webhook
    this.webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
    this.webhookKey = import.meta.env.VITE_N8N_WEBHOOK_KEY
    this.api = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async sendMessage(messageData) {
    try {
      if (!this.webhookUrl) {
        throw new Error('N8N webhook não configurado')
      }

      // Sanitizar dados antes de enviar
      const sanitizedData = {
        user_id: this.sanitizeString(messageData.user_id),
        message: this.sanitizeString(messageData.message),
        session_id: this.sanitizeString(messageData.session_id),
        user_profile: messageData.user_profile,
        timestamp: new Date().toISOString()
      }

      // Configurar headers com chave de segurança
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      // Adicionar header de autenticação se configurado
      if (this.webhookKey) {
        config.headers['Authorization'] = `Bearer ${this.webhookKey}`
        // Ou usar header customizado:
        // config.headers['X-Webhook-Key'] = this.webhookKey
        // config.headers['X-API-Key'] = this.webhookKey
      }

      // Enviar DIRETO para seu N8N com headers seguros
      const response = await this.api.post(this.webhookUrl, sanitizedData, config)
      
      return response.data
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Erro de autenticação com o webhook')
      }
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      
      throw new Error('Erro de conexão com o N8N')
    }
  }

  sanitizeString(str) {
    if (typeof str !== 'string') return str
    
    // Remove caracteres potencialmente perigosos
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>]/g, '')
      .trim()
  }
}

export const chatService = new ChatService()