import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Search from './pages/Search'
import Compare from './pages/Compare'
import HotelDetail from './pages/HotelDetail'
import Profile from './pages/Profile'

function App() {
  const path = window.location.pathname
  if (path === '/login') return <Login />
  if (path === '/signup') return <Signup />
  if (path === '/search') return <Search />
  if (path === '/compare') return <Compare />
  if (path === '/profile') return <Profile />
  if (path.startsWith('/hotel/')) return <HotelDetail />
  return <Landing />
}

export default App
