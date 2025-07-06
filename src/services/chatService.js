import axios from 'axios'

class ChatService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async sendMessage(messageData) {
    try {
      // Sanitizar dados antes de enviar
      const sanitizedData = {
        user_id: this.sanitizeString(messageData.user_id),
        message: this.sanitizeString(messageData.message),
        session_id: this.sanitizeString(messageData.session_id),
        user_profile: messageData.user_profile
      }

      const response = await this.api.post('/api/chat', sanitizedData)
      
      return response.data
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      
      throw new Error('Erro de conexão com o servidor')
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