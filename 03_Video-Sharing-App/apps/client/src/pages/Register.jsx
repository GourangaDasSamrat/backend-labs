import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  const [form, setForm] = useState({ userName: '', email: '', password: '', fullname: '' })
  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleFile = (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    if (type === 'avatar') { setAvatar(file); setAvatarPreview(url) }
    else { setCoverImage(file); setCoverPreview(url) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!avatar) return toast.error('Avatar is required')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('avatar', avatar)
      if (coverImage) fd.append('coverImage', coverImage)
      await register(fd)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-xl shadow-purple-500/30 mx-auto mb-4">
            <i className="bi bi-play-fill text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Create Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Join the StreamVibe community</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/30 border border-gray-100 dark:border-gray-800 p-8">
          {/* Cover image preview */}
          <div
            className="relative w-full h-28 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 mb-4 overflow-hidden cursor-pointer group"
            onClick={() => document.getElementById('cover-input').click()}
          >
            {coverPreview && <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <i className="bi bi-camera" /> Add cover image
              </span>
            </div>
            <input id="cover-input" type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, 'cover')} />
          </div>

          {/* Avatar */}
          <div className="flex items-end gap-4 mb-6 -mt-8 ml-4">
            <div
              className="relative w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 overflow-hidden cursor-pointer border-4 border-white dark:border-gray-900 shadow-lg group"
              onClick={() => document.getElementById('avatar-input').click()}
            >
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-400"><i className="bi bi-person text-2xl" /></div>
              }
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i className="bi bi-camera text-white" />
              </div>
              <input id="avatar-input" type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, 'avatar')} required />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 pb-1">
              <span className="text-red-500">*</span> Avatar required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input-field"
                  value={form.fullname}
                  onChange={e => setForm(p => ({ ...p, fullname: e.target.value }))}
                  required
                />
              </div>
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
            </div>

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
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2">
              {loading ? <><i className="bi bi-arrow-repeat animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
