import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Onboarding from './components/Onboarding'
import Chat from './components/Chat'
import Profile from './components/Profile'
import { authService } from './services/authService'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        // Verificar se completou onboarding
        const profile = await authService.getUserProfile(currentUser.id)
        setHasCompletedOnboarding(!!profile?.onboarding_completed)
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (userData) => {
    setUser(userData)
    // Verificar onboarding após login
    const profile = await authService.getUserProfile(userData.id)
    setHasCompletedOnboarding(!!profile?.onboarding_completed)
  }

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true)
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setHasCompletedOnboarding(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              !user ? (
                <Login onLogin={handleLogin} />
              ) : hasCompletedOnboarding ? (
                <Navigate to="/chat" replace />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            } 
          />
          
          <Route 
            path="/onboarding" 
            element={
              user && !hasCompletedOnboarding ? (
                <Onboarding 
                  user={user} 
                  onComplete={handleOnboardingComplete}
                />
              ) : user ? (
                <Navigate to="/chat" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/chat" 
            element={
              user && hasCompletedOnboarding ? (
                <Chat user={user} onLogout={handleLogout} />
              ) : user ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              user ? (
                <Profile user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/" 
            element={
              user ? (
                hasCompletedOnboarding ? (
                  <Navigate to="/chat" replace />
                ) : (
                  <Navigate to="/onboarding" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App