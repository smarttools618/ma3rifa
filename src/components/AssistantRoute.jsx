import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AssistantRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || userRole !== 'assistant') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AssistantRoute