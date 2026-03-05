import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/api'
import Avatar from '../components/ui/Avatar'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [form, setForm] = useState({ fullname: user?.fullname || '', email: user?.email || '', userName: user?.userName || '' })
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confPassword: '' })
  const [loading, setLoading] = useState(false)

  const tabs = ['Profile', 'Password', 'Appearance']

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await userService.updateDetails(form)
      updateUser({ ...user, ...res.data.data })
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await userService.changePassword(passForm)
      toast.success('Password changed!')
      setPassForm({ oldPassword: '', newPassword: '', confPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('avatar', file)
    try {
      const res = await userService.updateAvatar(fd)
      updateUser({ ...user, avatar: res.data.data.avatar })
      toast.success('Avatar updated!')
    } catch {
      toast.error('Failed to update avatar')
    }
  }

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('coverImage', file)
    try {
      const res = await userService.updateCover(fd)
      updateUser({ ...user, coverImage: res.data.data.coverImage })
      toast.success('Cover updated!')
    } catch {
      toast.error('Failed to update cover')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage your account</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 dark:border-gray-800 mb-8">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === i
                ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="space-y-6">
          {/* Cover image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image</label>
            <div
              className="relative h-32 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 cursor-pointer group"
              onClick={() => document.getElementById('cover-settings').click()}
            >
              {user?.coverImage && <img src={user.coverImage} alt="cover" className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium"><i className="bi bi-camera mr-2" />Change cover</span>
              </div>
            </div>
            <input id="cover-settings" type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div
              className="relative cursor-pointer group"
              onClick={() => document.getElementById('avatar-settings').click()}
            >
              <Avatar src={user?.avatar} name={user?.fullname} size="xl" />
              <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i className="bi bi-camera text-white" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{user?.fullname}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.userName}</p>
              <button
                onClick={() => document.getElementById('avatar-settings').click()}
                className="text-xs text-purple-600 dark:text-purple-400 mt-1 hover:underline"
              >
                Change avatar
              </button>
            </div>
            <input id="avatar-settings" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Form */}
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input type="text" className="input-field" value={form.fullname} onChange={e => setForm(p => ({ ...p, fullname: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
              <input type="text" className="input-field" value={form.userName} onChange={e => setForm(p => ({ ...p, userName: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input type="email" className="input-field" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <><i className="bi bi-arrow-repeat animate-spin" /> Saving...</> : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 1 && (
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            { key: 'oldPassword', label: 'Current Password' },
            { key: 'newPassword', label: 'New Password' },
            { key: 'confPassword', label: 'Confirm New Password' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{field.label}</label>
              <input
                type="password"
                className="input-field"
                value={passForm[field.key]}
                onChange={e => setPassForm(p => ({ ...p, [field.key]: e.target.value }))}
                required
              />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <><i className="bi bi-arrow-repeat animate-spin" /> Changing...</> : 'Change Password'}
          </button>
        </form>
      )}

      {activeTab === 2 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Theme</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Toggle theme using the sun/moon icon in the navigation bar.</p>
          <div className="mt-4 flex gap-3">
            {['Light', 'Dark'].map(mode => (
              <div key={mode} className={`flex-1 rounded-xl border-2 p-4 text-center cursor-pointer transition-all ${
                mode === 'Dark' ? 'border-purple-500 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900'
              }`}>
                <i className={`bi ${mode === 'Dark' ? 'bi-moon-fill' : 'bi-sun-fill'} text-xl mb-2 block`} />
                <span className="text-sm font-medium">{mode}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
