import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center mb-6">
      <span className="text-5xl font-bold gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>404</span>
    </div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
      Page Not Found
    </h1>
    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn-primary flex items-center gap-2">
      <i className="bi bi-house" /> Go Home
    </Link>
  </div>
)

export default NotFound
