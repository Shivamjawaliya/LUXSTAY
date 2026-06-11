export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-gray-100">
        <span className="text-lg font-semibold tracking-tight text-gray-900">LuxStay</span>
        <div className="flex items-center gap-6">
          <a href="/login" className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">Sign in</a>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <span className="inline-block text-xs font-medium tracking-widest text-gray-400 uppercase border border-gray-200 rounded-full px-4 py-1.5 mb-8">
          Hotel Search &amp; Comparison
        </span>

        <h1 className="text-5xl sm:text-6xl font-semibold text-gray-900 leading-[1.1] max-w-2xl tracking-tight">
          Find your perfect<br />place to stay
        </h1>

        <p className="mt-6 text-gray-400 text-base max-w-md leading-relaxed">
          Search hotels worldwide, compare prices side by side, and book with confidence using real-time data.
        </p>

        <div className="mt-10 flex gap-3">
          <a
            href="/search?fresh=1"
            className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
          >
            Start for free
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 flex gap-12 text-center">
          {[
            { label: 'Hotels', value: '500K+' },
            { label: 'Destinations', value: '190+' },
            { label: 'Reviews', value: '2M+' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-1 tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <section className="border-t border-gray-100 px-8 py-14">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: '🔍',
              title: 'Smart Search',
              desc: 'Filter by destination, dates, and guests. Instant suggestions for 80+ cities.',
            },
            {
              icon: '⚖️',
              title: 'Side-by-side Compare',
              desc: 'Select up to 3 hotels and compare price, rating, and amenities with charts.',
            },
            {
              icon: '🔒',
              title: 'Secure Auth',
              desc: 'Login with email or OAuth (Google, GitHub). JWT-secured sessions.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-3">
              <span className="text-2xl">{icon}</span>
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-5 flex items-center justify-between text-xs text-gray-400">
        <span>© {new Date().getFullYear()} LuxStay</span>
        <span>Built with React 18 + Supabase + SerpApi</span>
      </footer>
    </div>
  )
}
