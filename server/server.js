const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.N8N_WEBHOOK_URL],
    },
  },
  crossOriginEmbedderPolicy: false
}))

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  next()
})

// Rate limiting simple
const rateLimit = new Map()
const RATE_LIMIT_WINDOW = 60000 // 1 minuto
const RATE_LIMIT_MAX = 10 // 10 requests por minuto

app.use('/api/chat', (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress
  const now = Date.now()
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
  } else {
    const limit = rateLimit.get(ip)
    
    if (now > limit.resetTime) {
      limit.count = 1
      limit.resetTime = now + RATE_LIMIT_WINDOW
    } else {
      limit.count++
      
      if (limit.count > RATE_LIMIT_MAX) {
        return res.status(429).json({ 
          error: 'Muitas requisições. Tente novamente em 1 minuto.' 
        })
      }
    }
  }
  
  next()
})

// Input validation middleware
const validateChatInput = (req, res, next) => {
  const { user_id, message, session_id } = req.body

  if (!user_id || typeof user_id !== 'string') {
    return res.status(400).json({ error: 'user_id é obrigatório' })
  }

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message é obrigatória' })
  }

  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ error: 'session_id é obrigatório' })
  }

  // Sanitizar mensagem
  req.body.message = message
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim()

  if (req.body.message.length > 1000) {
    return res.status(400).json({ error: 'Mensagem muito longa' })
  }

  next()
}

// Chat endpoint - Proxy seguro para N8N
app.post('/api/chat', validateChatInput, async (req, res) => {
  try {
    const { user_id, message, session_id, user_profile } = req.body

    // URL do webhook N8N (deve ser configurada como variável de ambiente)
    const webhookUrl = process.env.N8N_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL não configurada')
      return res.status(500).json({ 
        error: 'Configuração do servidor incompleta' 
      })
    }

    // Dados para enviar ao N8N
    const webhookData = {
      user_id,
      message,
      session_id,
      user_profile,
      timestamp: new Date().toISOString()
    }

    // Fazer requisição para o webhook N8N
    const fetch = (await import('node-fetch')).default
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MaitoGuyFit/1.0'
      },
      body: JSON.stringify(webhookData),
      timeout: 25000
    })

    if (!response.ok) {
      throw new Error(`Webhook respondeu com status ${response.status}`)
    }

    const result = await response.json()

    // Retornar resposta do Maito Guy
    res.json({
      success: true,
      message: result.message || result.response || 'Resposta recebida!',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro no endpoint de chat:', error)
    
    // Resposta de fallback do Maito Guy
    res.status(200).json({
      success: false,
      message: '🔥 JUVENTUDE! Parece que houve um problema na comunicação, mas não desista! Suas chamas da juventude são mais fortes que qualquer obstáculo! Tente novamente! 💪',
      timestamp: new Date().toISOString()
    })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'MaitoGuyFit API' 
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err)
  res.status(500).json({ 
    error: 'Erro interno do servidor' 
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado' 
  })
})

app.listen(PORT, () => {
  console.log(`🔥 Servidor Maito Guy Fit rodando na porta ${PORT}`)
  console.log(`🔥 Webhook N8N: ${process.env.N8N_WEBHOOK_URL ? 'Configurado' : 'NÃO CONFIGURADO'}`)
})