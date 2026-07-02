import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/axiosClient'
import { Globe, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  // Basic styling classes
  const inputClass = "w-full px-4 py-2 bg-surface/50 border border-surface-border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        // Register flow
        if (!form.email) {
          throw new Error('Email is required for registration')
        }
        await authApi.register({
          username: form.username,
          email: form.email,
          password: form.password,
          roles: ['ROLE_USER']
        })
        
        // Auto-login after successful registration
        const { data } = await authApi.login({
          username: form.username,
          password: form.password
        })
        login({ username: data.username, roles: data.roles }, data.accessToken)
        
      } else {
        // Login flow
        const { data } = await authApi.login({
          username: form.username,
          password: form.password
        })
        login({ username: data.username, roles: data.roles }, data.accessToken)
      }

      // Redirect back to where they were, or home
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
      
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError(err.message || 'An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="w-full max-w-md p-8 glass rounded-2xl border border-surface-border shadow-card animate-fade-in relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="relative text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow mx-auto mb-4">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {isRegister 
              ? 'Join TravelSphere to get personalised recommendations.' 
              : 'Sign in to access your planner and dashboard.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
            <input 
              type="text" 
              required
              value={form.username}
              onChange={e => setForm({...form, username: e.target.value})}
              className={inputClass}
              placeholder="e.g. wanderlust99"
            />
          </div>

          {isRegister && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input 
                type="email" 
                required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full justify-center py-2.5 mt-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
            ) : isRegister ? (
              <><UserPlus className="w-4 h-4" /> Create Account</>
            ) : (
              <><LogIn className="w-4 h-4" /> Sign In</>
            )}
          </button>
        </form>

        <div className="relative mt-6 pt-6 border-t border-surface-border text-center">
          <p className="text-slate-400 text-sm">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button 
              type="button"
              onClick={() => {
                setIsRegister(!isRegister)
                setError('')
              }}
              className="ml-2 text-brand-400 font-medium hover:text-brand-300 hover:underline transition-all"
            >
              {isRegister ? 'Sign in instead' : 'Register now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
