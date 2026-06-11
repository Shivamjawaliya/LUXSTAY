export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-gray-900">LuxStay</span>
        <div className="flex gap-4 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-900 transition-colors">About</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Help</a>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">
          Hotel Search &amp; Comparison
        </p>

        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight max-w-xl">
          Find your next<br />place to stay
        </h1>

        <p className="mt-5 text-gray-400 text-base max-w-sm leading-relaxed">
          Search hotels worldwide, filter by your preferences, and compare options side by side.
        </p>

        <button
          onClick={() => window.location.href = '/login'}
          className="mt-10 px-7 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Get started
        </button>

        {/* subtle stat row */}
        <div className="mt-16 flex gap-10 text-center">
          {[
            { label: 'Hotels', value: '500K+' },
            { label: 'Destinations', value: '190+' },
            { label: 'Reviews', value: '2M+' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xl font-semibold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} LuxStay. All rights reserved.
      </footer>
    </div>
  )
}
