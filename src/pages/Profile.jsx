import { useAuth } from '../context/AuthContext'

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Profile() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const provider = user?.app_metadata?.provider ?? 'email'
  const initials = (user?.email ?? '?').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <a href="/" className="text-base font-semibold tracking-tight text-gray-900">LuxStay</a>
        <button onClick={() => window.history.back()} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Back</button>
      </header>

      <main className="max-w-md mx-auto px-6 py-12">
        {/* Avatar card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <h1 className="text-base font-semibold text-gray-900 text-center">{user?.email}</h1>
          <span className="mt-2 text-xs px-3 py-1 bg-gray-100 text-gray-500 rounded-full capitalize">{provider} account</span>
        </div>

        {/* Info rows */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <Row label="Email" value={user?.email ?? '—'} />
          <Row label="Member since" value={fmt(user?.created_at)} />
          <Row label="Last sign in" value={fmt(user?.last_sign_in_at)} />
          <Row label="User ID" value={user?.id ? `${user.id.slice(0, 8)}…` : '—'} mono />
        </div>

        {/* JWT token status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <Row label="Session token" value={localStorage.getItem('luxstay_token') ? 'Active ✓' : 'None'} />
          <Row label="Auth provider" value={provider} />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <a
            href="/search"
            className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-medium text-center hover:bg-gray-700 transition-colors"
          >
            Back to search
          </a>
          <button
            onClick={handleSignOut}
            className="w-full py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  )
}

function Row({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className={`text-xs text-gray-900 text-right ml-4 truncate max-w-[60%] ${mono ? 'font-mono' : 'font-medium'}`}>{value}</span>
    </div>
  )
}
