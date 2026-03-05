import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth.api'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ userName: '', email: '', fullname: '', password: '' })
  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFile = (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    if (type === 'avatar') {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    } else {
      setCoverImage(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!avatar) return toast.error('Avatar is required')
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      formData.append('avatar', avatar)
      if (coverImage) formData.append('coverImage', coverImage)
      await registerUser(formData)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200 dark:shadow-purple-900/40">
            <i className="bi bi-person-plus-fill text-white text-xl"></i>
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Join StreamVault today</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl shadow-purple-100 dark:shadow-purple-900/20 border border-purple-100 dark:border-purple-900/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar upload */}
            <div className="flex justify-center mb-2">
              <label className="cursor-pointer relative group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 flex items-center justify-center overflow-hidden border-2 border-dashed border-purple-300 dark:border-purple-600 group-hover:border-purple-500 transition-colors">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <i className="bi bi-camera text-2xl text-purple-400"></i>
                      <p className="text-xs text-purple-400 mt-1">Avatar*</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'avatar')} className="hidden" />
              </label>
            </div>

            {[
              { name: 'fullname', placeholder: 'Full Name', icon: 'bi-person' },
              { name: 'userName', placeholder: 'Username', icon: 'bi-at' },
              { name: 'email', placeholder: 'Email', icon: 'bi-envelope', type: 'email' },
              { name: 'password', placeholder: 'Password', icon: 'bi-lock', type: 'password' },
            ].map((field) => (
              <div key={field.name} className="relative">
                <i className={`bi ${field.icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400`}></i>
                <input
                  name={field.name}
                  type={field.type || 'text'}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 text-gray-800 dark:text-gray-200 outline-none transition-colors text-sm"
                />
              </div>
            ))}

            <label className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 cursor-pointer hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
              <i className="bi bi-image text-gray-400"></i>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {coverImage ? coverImage.name : 'Cover image (optional)'}
              </span>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'cover')} className="hidden" />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Creating account...</>
              ) : (
                <><i className="bi bi-person-check"></i> Create Account</>
              )}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
