import { useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setAuthError(error.message)
    } else {
      window.location.href = '/search'
    }
    setLoading(false)
  }

  const handleOAuth = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/search` },
    })
  }

  if (user) {
    window.location.href = '/search'
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/25 blur-3xl anim-float" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl anim-float delay-300" />

      <div className="relative z-10 w-full max-w-sm anim-scale-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <a href="/" className="text-3xl font-bold tracking-tight text-white">
            Lux<span className="text-indigo-400">Stay</span>
          </a>
          <p className="text-sm text-slate-400 mt-2">Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl px-8 py-8">
          {/* Google OAuth */}
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-800 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500 font-medium">or email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{authError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-900/50 active:scale-95 mt-1"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          <a href="/" className="hover:text-indigo-400 transition-colors">← Back to home</a>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
