import React, { useState } from 'react'
import { authService } from '../services/authService'
import LoadingSpinner from './LoadingSpinner'

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!isLogin && password !== confirmPassword) {
        setError('As senhas não coincidem')
        return
      }

      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres')
        return
      }

      let userData
      if (isLogin) {
        userData = await authService.login(email, password)
      } else {
        userData = await authService.register(email, password)
      }

      onLogin(userData)
    } catch (error) {
      setError(error.message || 'Erro ao fazer login/cadastro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Título */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-white">🔥 </span>
            <span style={{ color: '#1a4c2e' }}>MAITO GUY</span>
            <span className="text-white"> FIT</span>
          </h1>
          <p className="text-gray-400">Seu coach virtual de musculação</p>
        </div>

        {/* Formulário */}
        <div 
          className="rounded-lg p-6 shadow-lg slide-in-up"
          style={{ backgroundColor: '#111827' }}
        >
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-l-lg transition-colors ${
                isLogin 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{ 
                backgroundColor: isLogin ? '#1a4c2e' : 'transparent',
                borderColor: '#1a4c2e',
                border: '1px solid'
              }}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-r-lg transition-colors ${
                !isLogin 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{ 
                backgroundColor: !isLogin ? '#1a4c2e' : 'transparent',
                borderColor: '#1a4c2e',
                border: '1px solid'
              }}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors"
                style={{ '--tw-ring-color': '#1a4c2e' }}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors"
                style={{ '--tw-ring-color': '#1a4c2e' }}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors"
                  style={{ '--tw-ring-color': '#1a4c2e' }}
                  placeholder="Confirme sua senha"
                />
              </div>
            )}

            {error && (
              <div 
                className="p-3 rounded-lg text-white text-sm"
                style={{ backgroundColor: '#8b0000' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 font-medium text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
              style={{ backgroundColor: '#1a4c2e' }}
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                isLogin ? 'Entrar 🔥' : 'Criar Conta 💪'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>🔥 Desperte suas chamas da juventude! 💪</p>
        </div>
      </div>
    </div>
  )
}

export default Login