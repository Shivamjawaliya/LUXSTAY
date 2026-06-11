export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-stone-100">
        <span className="text-lg font-bold tracking-tight text-slate-900">
          Lux<span className="text-amber-500">Stay</span>
        </span>
        <a
          href="/login"
          className="text-sm px-5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium"
        >
          Sign in
        </a>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Subtle warm glow behind hero */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(251,191,36,0.12),transparent)]" />

        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-amber-600 uppercase bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-8">
          ✦ Hotel Search &amp; Comparison
        </span>

        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-[1.08] max-w-2xl tracking-tight">
          Find your perfect<br />
          <span className="text-amber-500">place to stay</span>
        </h1>

        <p className="mt-6 text-slate-500 text-base max-w-md leading-relaxed">
          Search hotels worldwide, compare prices side by side, and book with confidence using real-time data.
        </p>

        <div className="mt-10 flex gap-3">
          <a
            href="/search?fresh=1"
            className="px-7 py-3 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200"
          >
            Start for free →
          </a>
          <a
            href="/login"
            className="px-7 py-3 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-colors"
          >
            Sign in
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
              <p className="text-2xl font-bold text-amber-500">{value}</p>
              <p className="text-xs text-slate-400 mt-1 tracking-wide uppercase">{label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <section className="bg-slate-50 border-t border-stone-100 px-8 py-16">
        <p className="text-center text-xs font-semibold tracking-widest text-slate-400 uppercase mb-10">Everything you need</p>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: '🔍',
              color: 'bg-blue-50 text-blue-500',
              title: 'Smart Search',
              desc: 'Filter by destination, dates, and guests. Instant suggestions for 80+ cities worldwide.',
            },
            {
              icon: '⚖️',
              color: 'bg-amber-50 text-amber-500',
              title: 'Side-by-side Compare',
              desc: 'Select up to 3 hotels and compare prices, ratings, and amenities with live charts.',
            },
            {
              icon: '🔒',
              color: 'bg-emerald-50 text-emerald-500',
              title: 'Secure Auth',
              desc: 'Login with Google or email. JWT-secured sessions with Supabase.',
            },
          ].map(({ icon, color, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 ${color}`}>
                {icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 px-8 py-5 flex items-center justify-between text-xs text-slate-400">
        <span>© {new Date().getFullYear()} Lux<span className="text-amber-500 font-medium">Stay</span></span>
        <span>Built with React 18 · Supabase · SerpApi</span>
      </footer>
    </div>
  )
}
