import { useAuth } from '../context/AuthContext'

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function initials(email = '') {
  return email.slice(0, 2).toUpperCase()
}

export default function Profile() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const provider = user?.app_metadata?.provider ?? 'email'

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <button onClick={() => window.location.href = '/'} className="text-base font-semibold tracking-tight text-gray-900">
          LuxStay
        </button>
        <button onClick={() => window.history.back()} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← Back
        </button>
      </header>

      <main className="max-w-lg mx-auto px-6 py-14">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-4">
            <span className="text-2xl font-semibold text-white">{initials(user?.email)}</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{user?.email}</h1>
          <p className="text-xs text-gray-400 mt-1 capitalize">{provider} account</p>
        </div>

        {/* Info card */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden mb-6">
          <Row label="Email" value={user?.email ?? '—'} />
          <Row label="Member since" value={fmt(user?.created_at)} />
          <Row label="Last sign in" value={fmt(user?.last_sign_in_at)} />
          <Row label="User ID" value={user?.id ? `${user.id.slice(0, 8)}…` : '—'} mono />
        </div>

        {/* Actions */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          Sign out
        </button>

        <button
          onClick={() => window.location.href = '/search'}
          className="w-full mt-3 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Back to search
        </button>
      </main>
    </div>
  )
}

function Row({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-xs text-gray-900 text-right max-w-[60%] truncate ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}
