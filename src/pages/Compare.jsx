import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
function getCompare() {
  try { return JSON.parse(localStorage.getItem('luxstay_compare') ?? '[]') } catch { return [] }
}

function shortName(name = '') {
  return name.length > 18 ? name.slice(0, 16) + '…' : name
}

export default function Compare() {
  const [hotels, setHotels] = useState(getCompare)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = getCompare()
    setHotels(raw)
    setLoading(false)
  }, [])

  const removeHotel = (id) => {
    const updated = hotels.filter((h) => h.id !== id)
    setHotels(updated)
    localStorage.setItem('luxstay_compare', JSON.stringify(updated))
  }

  if (hotels.length < 2) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <p className="text-sm text-gray-400 mb-4">
          {hotels.length === 1 ? 'You need at least 2 hotels to compare.' : 'Select at least 2 hotels from Search to compare.'}
        </p>
        <button onClick={() => window.location.href = '/search'}
          className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
          Back to search
        </button>
      </div>
    )
  }

  const priceData = hotels.map((h) => ({
    name: shortName(h.name),
    Price: h.exactPrice ?? (parseFloat((h.price ?? '').replace(/[^0-9.]/g, '')) || 0),
  }))

  // grouped bar: one row per hotel, columns = Guest Rating + Stars
  const ratingData = hotels.map((h) => ({
    name: shortName(h.name),
    'Guest Rating': Number(h.guestRating ?? 0),
    'Star Class': Number(h.starRating ?? 0),
  }))

  const COLORS = ['#111827', '#6b7280', '#d1d5db']

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button onClick={() => window.location.href = '/'} className="text-base font-semibold tracking-tight text-gray-900">LuxStay</button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              localStorage.removeItem('luxstay_compare')
              setHotels([])
            }}
            className="text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            Clear all
          </button>
          <button onClick={() => window.location.href = '/search'} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Back to search</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-xl font-semibold text-gray-900 mb-8">Compare Hotels</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="border border-gray-200 rounded-xl overflow-hidden">
              {loading ? (
                <div className="w-full h-36 bg-gray-100 animate-pulse" />
              ) : hotel.image ? (
                <img src={hotel.image} alt={hotel.name} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">No image</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug">{hotel.name}</h3>
                  <button
                    onClick={() => removeHotel(hotel.id)}
                    title="Remove from comparison"
                    className="shrink-0 text-gray-300 hover:text-gray-700 transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                {hotel.address && <p className="text-xs text-gray-400 mt-1">{hotel.address}</p>}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-base font-semibold text-gray-900">
                    {hotel.price}<span className="text-xs font-normal text-gray-400"> /night</span>
                  </span>
                  {hotel.guestRating && (
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {hotel.guestRating} / 5
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading hotel details…</p>
          </div>
        ) : (
          <>
            {/* Price bar chart */}
            <section className="mb-12">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Price Comparison</h2>
              <p className="text-xs text-gray-400 mb-6">Nightly rate in USD</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={priceData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                    formatter={(val) => [`$${val}`, 'Price']}
                  />
                  <Bar dataKey="Price" fill="#111827" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>

            {/* Rating grouped bar chart */}
            <section className="mb-12">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Rating Comparison</h2>
              <p className="text-xs text-gray-400 mb-6">Guest rating (out of 5) and star class (out of 5)</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ratingData} barGap={4} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Guest Rating" fill="#111827" radius={[4, 4, 0, 0]} barSize={28} />
                  <Bar dataKey="Star Class" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </section>

            {/* Side-by-side table */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Side-by-side</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 pr-4 text-xs text-gray-400 font-medium w-32">Attribute</th>
                      {hotels.map((h) => (
                        <th key={h.id} className="text-left py-2 pr-4 text-xs font-medium text-gray-900">{h.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Price / night', render: (h) => h.price ?? '—' },
                      { label: 'Star class', render: (h) => h.starRating ? '★'.repeat(Math.min(h.starRating, 5)) : '—' },
                      { label: 'Guest rating', render: (h) => h.guestRating ? `${h.guestRating} / 5` : '—' },
                      { label: 'Reviews', render: (h) => h.reviewCount ? h.reviewCount.toLocaleString() : '—' },
                      { label: 'Free cancellation', render: (h) => h.freeCancellation ? 'Yes' : 'No' },
                      { label: 'Deal', render: (h) => h.deal ?? '—' },
                    ].map(({ label, render }) => (
                      <tr key={label} className="border-b border-gray-50">
                        <td className="py-2.5 pr-4 text-xs text-gray-400">{label}</td>
                        {hotels.map((h) => (
                          <td key={h.id} className="py-2.5 pr-4 text-xs text-gray-900">{render(h)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        <div className="mt-10 flex justify-end">
          <button
            onClick={() => { localStorage.removeItem('luxstay_compare'); window.location.href = '/search' }}
            className="text-sm text-gray-400 underline hover:text-gray-700 transition-colors"
          >
            Clear selection
          </button>
        </div>
      </main>
    </div>
  )
}
