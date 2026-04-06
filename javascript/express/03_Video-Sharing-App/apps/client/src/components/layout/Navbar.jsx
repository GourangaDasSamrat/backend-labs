import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { logoutUser } from '../../api/auth.api'
import toast from 'react-hot-toast'

const Navbar = ({ onMenuToggle }) => {
  const { user, setUser } = useAuth()
  const { dark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      setUser(null)
      navigate('/login')
      toast.success('Logged out successfully')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/90 backdrop-blur-md border-b border-purple-100 dark:border-purple-900/30 h-16">
      <div className="flex items-center h-full px-4 gap-3">
        {/* Hamburger */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
        >
          <i className="bi bi-list text-xl"></i>
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-4 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <i className="bi bi-play-fill text-white text-sm"></i>
          </div>
          <span className="font-display font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent hidden sm:block">
            StreamVault
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search videos..."
              className="w-full bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-purple-400 dark:focus:border-purple-500 rounded-xl px-4 py-2 pl-10 text-sm text-gray-800 dark:text-gray-200 outline-none transition-all"
            />
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
          >
            <i className={`bi ${dark ? 'bi-sun-fill text-yellow-400' : 'bi-moon-fill text-purple-600'} text-lg`}></i>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullname}&background=7c3aed&color=fff`}
                  alt={user.fullname}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-purple-300 dark:ring-purple-700"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block max-w-24 truncate">
                  {user.fullname}
                </span>
                <i className="bi bi-chevron-down text-xs text-gray-500 hidden md:block"></i>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900/30 py-2 z-50">
                  <Link
                    to={`/channel/${user.userName}`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <i className="bi bi-person-circle text-purple-500"></i> My Channel
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <i className="bi bi-speedometer2 text-blue-500"></i> Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <i className="bi bi-gear text-gray-500"></i> Settings
                  </Link>
                  <Link
                    to="/liked-videos"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <i className="bi bi-heart text-red-500"></i> Liked Videos
                  </Link>
                  <hr className="my-1 border-purple-100 dark:border-purple-900/30" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                  >
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
