export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── Hero (dark) ────────────────────────────────── */}
      <div className="relative bg-slate-950 flex flex-col overflow-hidden">

        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/30 blur-3xl anim-float" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-violet-600/25 blur-3xl anim-float delay-300" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-64 rounded-full bg-indigo-900/40 blur-3xl" />

        {/* Navbar */}
        <header className="relative z-10 px-8 py-5 flex items-center justify-between border-b border-white/10 anim-fade-in">
          <span className="text-lg font-bold tracking-tight text-white">
            Lux<span className="text-indigo-400">Stay</span>
          </span>
          <a
            href="/login"
            className="text-sm px-5 py-2 border border-white/20 text-white/80 rounded-xl hover:bg-white/10 hover:text-white transition-all font-medium active:scale-95"
          >
            Sign in
          </a>
        </header>

        {/* Hero content */}
        <main className="relative z-10 flex flex-col items-center justify-center px-6 py-28 text-center">
          <span className="anim-fade-up inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-indigo-300 uppercase bg-indigo-500/15 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-8">
            ✦ Hotel Search &amp; Comparison
          </span>

          <h1 className="anim-fade-up delay-100 text-5xl sm:text-6xl font-bold text-white leading-[1.08] max-w-2xl tracking-tight">
            Find your perfect<br />
            <span className="bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              place to stay
            </span>
          </h1>

          <p className="anim-fade-up delay-200 mt-6 text-slate-400 text-base max-w-md leading-relaxed">
            Search hotels worldwide, compare prices side by side, and book with confidence using real-time data.
          </p>

          <div className="anim-fade-up delay-300 mt-10 flex gap-3">
            <a
              href="/search?fresh=1"
              className="px-7 py-3 bg-linear-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-900/50 active:scale-95"
            >
              Start exploring →
            </a>
            <a
              href="/login"
              className="px-7 py-3 border border-white/20 text-white/70 text-sm font-medium rounded-xl hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              Sign in
            </a>
          </div>

          {/* Stats */}
          <div className="anim-fade-up delay-400 mt-20 flex gap-12 text-center">
            {[
              { label: 'Hotels', value: '500K+' },
              { label: 'Destinations', value: '190+' },
              { label: 'Reviews', value: '2M+' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{value}</p>
                <p className="text-xs text-slate-500 mt-1 tracking-widest uppercase">{label}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ── Features (light) ───────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-100 px-8 py-16">
        <p className="anim-fade-in text-center text-xs font-semibold tracking-widest text-slate-400 uppercase mb-10">Everything you need</p>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🔍', color: 'bg-indigo-50 text-indigo-500', border: 'hover:border-indigo-200', title: 'Smart Search', desc: 'Filter by destination, dates, and guests. Instant suggestions for 80+ cities worldwide.' },
            { icon: '⚖️', color: 'bg-violet-50 text-violet-500', border: 'hover:border-violet-200', title: 'Side-by-side Compare', desc: 'Select up to 3 hotels and compare prices, ratings, and amenities with live charts.' },
            { icon: '🔒', color: 'bg-emerald-50 text-emerald-500', border: 'hover:border-emerald-200', title: 'Secure Auth', desc: 'Login with Google or email. JWT-secured sessions powered by Supabase.' },
          ].map(({ icon, color, border, title, desc }, i) => (
            <div
              key={title}
              className={`anim-scale-in bg-white rounded-2xl border border-slate-200 ${border} shadow-sm p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 delay-${(i + 1) * 100}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 ${color}`}>{icon}</div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-slate-100 px-8 py-5 flex items-center justify-between text-xs text-slate-400">
        <span>© {new Date().getFullYear()} Lux<span className="text-indigo-500 font-medium">Stay</span></span>
        <span>React 18 · Supabase · SerpApi</span>
      </footer>
    </div>
  )
}
