import React, { useState, useEffect, useRef } from 'react'
import { Menu, Send, User } from 'lucide-react'
import { chatService } from '../services/chatService'
import { authService } from '../services/authService'
import ChatMessage from './ChatMessage'
import LoadingSpinner from './LoadingSpinner'

const Chat = ({ user, onLogout }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    initializeChat()
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const initializeChat = async () => {
    try {
      // Carregar perfil do usuário
      const profile = await authService.getUserProfile(user.id)
      setUserProfile(profile)

      // Carregar mensagens do localStorage
      const savedMessages = localStorage.getItem(`chat_${user.id}`)
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      } else {
        // Primeira mensagem de boas-vindas
        const welcomeMessage = {
          id: 'welcome-1',
          sender: 'maito',
          message: `🔥 YOSHAAA! JUVENTUDE!\n\nOlá ${profile?.nome || 'Guerreiro'}! Suas chamas chegaram até mim! Vejo que você quer focar em ${profile?.objetivo || 'seus objetivos'} - que objetivo fantástico!\n\nMe conta, qual sua maior dificuldade atual nos treinos? 💪`,
          timestamp: new Date().toISOString()
        }
        setMessages([welcomeMessage])
        saveMessagesToStorage([welcomeMessage])
      }
    } catch (error) {
      console.error('Erro ao inicializar chat:', error)
    }
  }

  const saveMessagesToStorage = (msgs) => {
    localStorage.setItem(`chat_${user.id}`, JSON.stringify(msgs))
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: inputMessage.trim(),
      timestamp: new Date().toISOString()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    saveMessagesToStorage(newMessages)
    
    setInputMessage('')
    setLoading(true)
    setIsTyping(true)

    try {
      // Enviar mensagem para o webhook N8N
      const response = await chatService.sendMessage({
        user_id: user.id,
        message: userMessage.message,
        session_id: `chat-${user.id}`,
        user_profile: userProfile
      })

      // Simular delay de digitação
      await new Promise(resolve => setTimeout(resolve, 1000))

      const maitoMessage = {
        id: `maito-${Date.now()}`,
        sender: 'maito',
        message: response.message || response.response || 'Desculpe, houve um problema. Tente novamente! 🔥',
        timestamp: new Date().toISOString()
      }

      const updatedMessages = [...newMessages, maitoMessage]
      setMessages(updatedMessages)
      saveMessagesToStorage(updatedMessages)

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      const errorMessage = {
        id: `maito-error-${Date.now()}`,
        sender: 'maito',
        message: '🔥 JUVENTUDE! Parece que houve um problema na comunicação. Mas não desista! Suas chamas da juventude são mais fortes que qualquer obstáculo! Tente novamente! 💪',
        timestamp: new Date().toISOString()
      }

      const updatedMessages = [...newMessages, errorMessage]
      setMessages(updatedMessages)
      saveMessagesToStorage(updatedMessages)
    } finally {
      setLoading(false)
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <header 
        className="flex items-center justify-between p-4 border-b"
        style={{ 
          backgroundColor: '#1a4c2e',
          borderBottomColor: '#0f3c1f'
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            style={{ backgroundColor: '#0f3c1f' }}
          >
            🔥
          </div>
          <div>
            <h1 className="font-bold text-white">Maito Guy</h1>
            <p className="text-xs text-green-200">
              {isTyping ? 'Digitando...' : 'Online'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-white hover:bg-green-900 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Menu Dropdown */}
        {showMenu && (
          <div 
            className="absolute top-16 right-4 w-48 rounded-lg shadow-lg border z-50"
            style={{ 
              backgroundColor: '#111827',
              borderColor: '#374151'
            }}
          >
            <button
              onClick={() => {
                setShowMenu(false)
                // Navegar para perfil seria implementado aqui
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 flex items-center gap-2"
            >
              <User size={16} />
              Perfil
            </button>
            <button
              onClick={() => {
                setShowMenu(false)
                onLogout()
              }}
              className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-700"
            >
              Sair
            </button>
          </div>
        )}
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isOwn={message.sender === 'user'}
          />
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div 
              className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg"
              style={{ backgroundColor: '#374151' }}
            >
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs text-gray-400 ml-2">Maito Guy está digitando...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div 
        className="p-4 border-t"
        style={{ 
          backgroundColor: '#1a1a1a',
          borderTopColor: '#374151'
        }}
      >
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            rows={1}
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
            style={{ 
              '--tw-ring-color': '#1a4c2e',
              minHeight: '48px',
              maxHeight: '120px'
            }}
            disabled={loading}
          />
          
          <button
            onClick={handleSendMessage}
            disabled={loading || !inputMessage.trim()}
            className="p-3 rounded-lg text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            style={{ backgroundColor: '#1a4c2e' }}
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat