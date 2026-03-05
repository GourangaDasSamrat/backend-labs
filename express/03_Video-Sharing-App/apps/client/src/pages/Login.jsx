import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [form, setForm] = useState({ userName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [useEmail, setUseEmail] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = useEmail
        ? { email: form.email, password: form.password }
        : { userName: form.userName, password: form.password }
      await login(payload)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-xl shadow-purple-500/30 mx-auto mb-4">
            <i className="bi bi-play-fill text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span className="gradient-text">Stream</span>
            <span className="text-gray-900 dark:text-white">Vibe</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/30 border border-gray-100 dark:border-gray-800 p-8">
          {/* Toggle login method */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
            {['Username', 'Email'].map((method, i) => (
              <button
                key={method}
                onClick={() => setUseEmail(i === 1)}
                className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 ${
                  (i === 1) === useEmail
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!useEmail ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
                <input
                  type="text"
                  placeholder="johndoe"
                  className="input-field"
                  value={form.userName}
                  onChange={e => setForm(p => ({ ...p, userName: e.target.value }))}
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-field"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2">
              {loading ? <><i className="bi bi-arrow-repeat animate-spin" /> Signing in...</> : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
