import React, { useState, useEffect } from 'react'
import { ArrowLeft, Edit3, Save, X } from 'lucide-react'
import { authService } from '../services/authService'
import LoadingSpinner from './LoadingSpinner'

const Profile = ({ user, onLogout }) => {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    try {
      const profileData = await authService.getUserProfile(user.id)
      setProfile(profileData)
      setFormData(profileData || {})
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await authService.saveUserProfile(user.id, formData)
      setProfile(formData)
      setEditing(false)
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile || {})
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header 
        className="flex items-center justify-between p-4 border-b"
        style={{ 
          backgroundColor: '#1a4c2e',
          borderBottomColor: '#0f3c1f'
        }}
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.history.back()}
            className="p-2 text-white hover:bg-green-900 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-white">Perfil</h1>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="p-2 text-white hover:bg-green-900 rounded-lg transition-colors"
          >
            <Edit3 size={20} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="p-2 text-white hover:bg-red-900 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-2 text-white hover:bg-green-900 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? <LoadingSpinner size="small" /> : <Save size={20} />}
            </button>
          </div>
        )}
      </header>

      <div className="p-4 max-w-md mx-auto">
        {/* Avatar Section */}
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{ backgroundColor: '#1a4c2e' }}
          >
            🔥
          </div>
          <h2 className="text-xl font-bold text-white">
            {profile?.nome || 'Guerreiro'}
          </h2>
          <p className="text-gray-400">{user.email}</p>
        </div>

        {/* Profile Data */}
        <div 
          className="rounded-lg p-6 space-y-4"
          style={{ backgroundColor: '#111827' }}
        >
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.nome || ''}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
            ) : (
              <p className="text-white">{profile?.nome || 'Não informado'}</p>
            )}
          </div>

          {/* Objetivo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Objetivo
            </label>
            {editing ? (
              <select
                value={formData.objetivo || ''}
                onChange={(e) => setFormData({...formData, objetivo: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                <option value="">Selecione...</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="forca">Força</option>
                <option value="resistencia">Resistência</option>
                <option value="emagrecimento">Emagrecimento</option>
              </select>
            ) : (
              <p className="text-white capitalize">{profile?.objetivo || 'Não informado'}</p>
            )}
          </div>

          {/* Experiência */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Experiência
            </label>
            <p className="text-white capitalize">{profile?.experiencia || 'Não informado'}</p>
          </div>

          {/* Frequência */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Frequência de Treino
            </label>
            <p className="text-white">{profile?.frequencia || 'Não informado'}</p>
          </div>

          {/* Dados Físicos */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Peso (kg)
              </label>
              {editing ? (
                <input
                  type="number"
                  value={formData.peso || ''}
                  onChange={(e) => setFormData({...formData, peso: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              ) : (
                <p className="text-white">{profile?.peso || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Altura (m)
              </label>
              {editing ? (
                <input
                  type="number"
                  step="0.01"
                  value={formData.altura || ''}
                  onChange={(e) => setFormData({...formData, altura: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              ) : (
                <p className="text-white">{profile?.altura || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Idade
              </label>
              {editing ? (
                <input
                  type="number"
                  value={formData.idade || ''}
                  onChange={(e) => setFormData({...formData, idade: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              ) : (
                <p className="text-white">{profile?.idade || 'N/A'}</p>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-6 border-t border-gray-700">
            <button
              onClick={onLogout}
              className="w-full py-3 px-4 font-medium text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: '#8b0000' }}
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile