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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <header className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <a href="/" className="text-base font-bold tracking-tight text-slate-900">
          Lux<span className="text-amber-500">Stay</span>
        </a>
        <button onClick={() => window.history.back()} className="text-sm text-slate-400 hover:text-slate-900 transition-colors">← Back</button>
      </header>

      <main className="max-w-md mx-auto px-6 py-12">
        {/* Avatar card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-lg shadow-slate-100/60 p-8 flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-200">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <h1 className="text-base font-semibold text-slate-900 text-center">{user?.email}</h1>
          <span className="mt-2 text-xs px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full capitalize font-medium">{provider} account</span>
        </div>

        {/* Info rows */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-4">
          <Row label="Email" value={user?.email ?? '—'} />
          <Row label="Member since" value={fmt(user?.created_at)} />
          <Row label="Last sign in" value={fmt(user?.last_sign_in_at)} />
          <Row label="User ID" value={user?.id ? `${user.id.slice(0, 8)}…` : '—'} mono />
        </div>

        {/* Session */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-6">
          <Row label="Session token" value={localStorage.getItem('luxstay_token') ? 'Active ✓' : 'None'} accent />
          <Row label="Auth provider" value={provider} />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <a
            href="/search"
            className="w-full py-3 bg-amber-500 text-white rounded-xl text-sm font-semibold text-center hover:bg-amber-600 transition-colors shadow-md shadow-amber-200"
          >
            Back to search
          </a>
          <button
            onClick={handleSignOut}
            className="w-full py-3 border border-stone-200 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  )
}

function Row({ label, value, mono = false, accent = false }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-50 last:border-0">
      <span className="text-xs text-slate-400 shrink-0 font-medium">{label}</span>
      <span className={`text-xs text-right ml-4 truncate max-w-[60%] ${mono ? 'font-mono text-slate-600' : 'font-semibold text-slate-800'} ${accent ? 'text-emerald-600' : ''}`}>
        {value}
      </span>
    </div>
  )
}
