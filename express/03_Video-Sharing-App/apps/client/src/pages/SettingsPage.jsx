import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateAccountDetails, updateAvatar, updateCoverImage, changePassword } from '../api/auth.api'
import toast from 'react-hot-toast'

const SettingsPage = () => {
  const { user, setUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState({ fullname: user?.fullname || '', email: user?.email || '', userName: user?.userName || '' })
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confPassword: '' })
  const [saving, setSaving] = useState(false)

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await updateAccountDetails(form)
      setUser(res.data.data)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await changePassword(passwords)
      toast.success('Password changed!')
      setPasswords({ oldPassword: '', newPassword: '', confPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      const res = await updateAvatar(formData)
      setUser(res.data.data)
      toast.success('Avatar updated!')
    } catch {
      toast.error('Failed to update avatar')
    }
  }

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('coverImage', file)
    try {
      const res = await updateCoverImage(formData)
      setUser(res.data.data)
      toast.success('Cover image updated!')
    } catch {
      toast.error('Failed to update cover')
    }
  }

  const TABS = [
    { id: 'profile', icon: 'bi-person', label: 'Profile' },
    { id: 'security', icon: 'bi-shield-lock', label: 'Security' },
    { id: 'images', icon: 'bi-images', label: 'Images' },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${tab === t.id
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <i className={`bi ${t.icon}`}></i> {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleProfileSave} className="space-y-5 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/30">
          {[
            { name: 'fullname', label: 'Full Name', icon: 'bi-person' },
            { name: 'userName', label: 'Username', icon: 'bi-at' },
            { name: 'email', label: 'Email', icon: 'bi-envelope', type: 'email' },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{f.label}</label>
              <div className="relative">
                <i className={`bi ${f.icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400`}></i>
                <input
                  name={f.name}
                  type={f.type || 'text'}
                  value={form[f.name]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-400 text-gray-800 dark:text-gray-200 outline-none transition-colors text-sm"
                />
              </div>
            </div>
          ))}
          <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <i className="bi bi-check2"></i>}
            Save Changes
          </button>
        </form>
      )}

      {tab === 'security' && (
        <form onSubmit={handlePasswordSave} className="space-y-5 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/30">
          {[
            { name: 'oldPassword', label: 'Current Password' },
            { name: 'newPassword', label: 'New Password' },
            { name: 'confPassword', label: 'Confirm New Password' },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{f.label}</label>
              <div className="relative">
                <i className="bi bi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  value={passwords[f.name]}
                  onChange={(e) => setPasswords({ ...passwords, [f.name]: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-400 text-gray-800 dark:text-gray-200 outline-none transition-colors text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          ))}
          <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:opacity-90 disabled:opacity-50">
            Change Password
          </button>
        </form>
      )}

      {tab === 'images' && (
        <div className="space-y-6 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/30">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Avatar</p>
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullname}&background=7c3aed&color=fff`}
                alt="avatar"
                className="w-16 h-16 rounded-2xl object-cover"
              />
              <label className="cursor-pointer px-4 py-2 rounded-xl border border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                <i className="bi bi-upload mr-2"></i>Change Avatar
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cover Image</p>
            <div className="h-28 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 overflow-hidden relative mb-3">
              {user?.coverImage && <img src={user.coverImage} alt="cover" className="w-full h-full object-cover" />}
            </div>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
              <i className="bi bi-upload"></i>Change Cover
              <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage
