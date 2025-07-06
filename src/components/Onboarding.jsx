import React, { useState } from 'react'
import { authService } from '../services/authService'
import LoadingSpinner from './LoadingSpinner'

const onboardingSteps = [
  {
    title: 'Seu Nome',
    field: 'nome',
    type: 'text',
    placeholder: 'Como posso te chamar?',
    required: true
  },
  {
    title: 'Seu Objetivo Principal',
    field: 'objetivo',
    type: 'select',
    options: [
      { value: 'hipertrofia', label: '💪 Hipertrofia (Ganhar massa muscular)' },
      { value: 'forca', label: '⚡ Força (Aumentar força máxima)' },
      { value: 'resistencia', label: '🏃 Resistência (Condicionamento físico)' },
      { value: 'emagrecimento', label: '🔥 Emagrecimento (Perder gordura)' }
    ],
    required: true
  },
  {
    title: 'Sua Experiência',
    field: 'experiencia',
    type: 'select',
    options: [
      { value: 'iniciante', label: '🌱 Iniciante (0-6 meses)' },
      { value: 'intermediario', label: '💪 Intermediário (6 meses - 2 anos)' },
      { value: 'avancado', label: '🔥 Avançado (2+ anos)' }
    ],
    required: true
  },
  {
    title: 'Frequência de Treino',
    field: 'frequencia',
    type: 'select',
    options: [
      { value: '3x', label: '3x por semana' },
      { value: '4x', label: '4x por semana' },
      { value: '5x', label: '5x por semana' },
      { value: '6x', label: '6x por semana' }
    ],
    required: true
  },
  {
    title: 'Preferência de Treino',
    field: 'preferencia',
    type: 'select',
    options: [
      { value: 'academia', label: '🏋️ Academia (musculação)' },
      { value: 'calistenia', label: '🤸 Calistenia (peso corporal)' },
      { value: 'hibrido', label: '🔥 Híbrido (academia + calistenia)' }
    ],
    required: true
  },
  {
    title: 'Dados Físicos - Peso (kg)',
    field: 'peso',
    type: 'number',
    placeholder: 'Ex: 75.5',
    required: true
  },
  {
    title: 'Dados Físicos - Altura (m)',
    field: 'altura',
    type: 'number',
    placeholder: 'Ex: 1.80',
    step: '0.01',
    required: true
  },
  {
    title: 'Idade',
    field: 'idade',
    type: 'number',
    placeholder: 'Ex: 28',
    required: true
  }
]

const Onboarding = ({ user, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentStepData = onboardingSteps[currentStep]
  const isLastStep = currentStep === onboardingSteps.length - 1

  const handleInputChange = (value) => {
    setFormData(prev => ({
      ...prev,
      [currentStepData.field]: value
    }))
  }

  const handleNext = () => {
    const currentValue = formData[currentStepData.field]
    
    if (currentStepData.required && (!currentValue || currentValue.toString().trim() === '')) {
      setError('Este campo é obrigatório')
      return
    }

    setError('')
    
    if (isLastStep) {
      handleSubmit()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setError('')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      await authService.saveUserProfile(user.id, {
        ...formData,
        onboarding_completed: true
      })
      
      onComplete()
    } catch (error) {
      setError('Erro ao salvar dados. Tente novamente.')
      console.error('Erro no onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderInput = () => {
    const value = formData[currentStepData.field] || ''

    if (currentStepData.type === 'select') {
      return (
        <div className="space-y-3">
          {currentStepData.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange(option.value)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:scale-[1.02] ${
                value === option.value
                  ? 'text-white border-opacity-100'
                  : 'text-gray-300 border-gray-600 hover:border-gray-500'
              }`}
              style={{
                backgroundColor: value === option.value ? '#1a4c2e' : '#374151',
                borderColor: value === option.value ? '#1a4c2e' : '#4b5563'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )
    }

    return (
      <input
        type={currentStepData.type}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={currentStepData.placeholder}
        step={currentStepData.step}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-lg"
        style={{ '--tw-ring-color': '#1a4c2e' }}
      />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-white">🔥 </span>
            <span style={{ color: '#1a4c2e' }}>PREPARAÇÃO</span>
          </h1>
          <p className="text-gray-400">Vamos conhecer suas chamas da juventude!</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Passo {currentStep + 1} de {onboardingSteps.length}</span>
            <span>{Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: '#1a4c2e',
                width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Form */}
        <div 
          className="rounded-lg p-6 shadow-lg slide-in-up"
          style={{ backgroundColor: '#111827' }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            {currentStepData.title}
          </h2>

          {renderInput()}

          {error && (
            <div 
              className="mt-4 p-3 rounded-lg text-white text-sm"
              style={{ backgroundColor: '#8b0000' }}
            >
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 px-4 font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Voltar
              </button>
            )}
            
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="flex-1 py-3 px-4 font-medium text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
              style={{ backgroundColor: '#1a4c2e' }}
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                isLastStep ? 'Finalizar 🔥' : 'Próximo 💪'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding