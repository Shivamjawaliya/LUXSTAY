import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Search from './pages/Search'
import Compare from './pages/Compare'
import HotelDetail from './pages/HotelDetail'
import Profile from './pages/Profile'

function Splash() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="text-lg font-semibold tracking-tight text-gray-900">LuxStay</span>
        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    </div>
  )
}

function App() {
  const path = window.location.pathname
  const { session, loading } = useAuth()

  if (loading) return <Splash />

  // Public routes — accessible without auth
  if (path === '/') return <Landing />
  if (path === '/login') return <Login />
  if (path === '/signup') return <Signup />

  // Protected routes — redirect to login if not authenticated
  if (!session) {
    window.location.replace('/login')
    return null
  }

  if (path === '/search') return <Search />
  if (path === '/compare') return <Compare />
  if (path === '/profile') return <Profile />
  if (path.startsWith('/hotel/')) return <HotelDetail />
  return <Landing />
}

export default App
