import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from './Spinner'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default ProtectedRoute
