import axios from 'axios'

class ChatService {
  constructor() {
    // Conecta DIRETO no seu N8N webhook
    this.webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
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

      // Enviar DIRETO para seu N8N
      const response = await this.api.post(this.webhookUrl, sanitizedData)
      
      return response.data
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
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