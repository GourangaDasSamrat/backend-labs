import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/', icon: 'bi-house-fill', label: 'Home' },
  { to: '/search', icon: 'bi-compass-fill', label: 'Explore' },
  { to: '/subscriptions', icon: 'bi-collection-play-fill', label: 'Subscriptions', auth: true },
  { to: '/watch-history', icon: 'bi-clock-history', label: 'History', auth: true },
  { to: '/liked-videos', icon: 'bi-heart-fill', label: 'Liked', auth: true },
  { to: '/playlists', icon: 'bi-collection-fill', label: 'Playlists', auth: true },
  { to: '/community', icon: 'bi-people-fill', label: 'Community', auth: true },
]

const Sidebar = ({ open }) => {
  const { user } = useAuth()

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" />
      )}
      <aside className={`
        fixed top-16 left-0 bottom-0 z-40 bg-white dark:bg-gray-950 border-r border-purple-100 dark:border-purple-900/30
        transition-all duration-300 overflow-y-auto overflow-x-hidden
        ${open ? 'w-60' : 'w-0 lg:w-16'}
      `}>
        <nav className="py-4 px-2">
          {navItems.map((item) => {
            if (item.auth && !user) return null
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all group
                  ${isActive
                    ? 'bg-gradient-to-r from-purple-600/10 to-blue-500/10 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                  }`
                }
              >
                <i className={`bi ${item.icon} text-lg flex-shrink-0`}></i>
                <span className={`text-sm font-medium whitespace-nowrap transition-all ${open ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                  {item.label}
                </span>
              </NavLink>
            )
          })}

          {user && (
            <>
              <hr className="my-3 border-purple-100 dark:border-purple-900/30" />
              <NavLink
                to="/upload"
                className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1 text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-opacity"
              >
                <i className="bi bi-plus-circle-fill text-lg flex-shrink-0"></i>
                <span className={`text-sm font-medium whitespace-nowrap ${open ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                  Upload Video
                </span>
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all
                  ${isActive
                    ? 'bg-gradient-to-r from-purple-600/10 to-blue-500/10 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                  }`
                }
              >
                <i className="bi bi-speedometer2 text-lg flex-shrink-0"></i>
                <span className={`text-sm font-medium whitespace-nowrap ${open ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                  Dashboard
                </span>
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
