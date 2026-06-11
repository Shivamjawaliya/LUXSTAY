import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LabelList, Cell, ReferenceLine,
} from 'recharts'

function getCompare() {
  try { return JSON.parse(localStorage.getItem('luxstay_compare') ?? '[]') } catch { return [] }
}

function shortName(name = '') {
  return name.length > 20 ? name.slice(0, 18) + '…' : name
}

const BAR_COLORS = ['#111827', '#4b5563', '#9ca3af']

function PriceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-base font-bold text-gray-900">${payload[0].value}<span className="text-xs font-normal text-gray-400"> /night</span></p>
    </div>
  )
}

function RatingTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-gray-900 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs text-gray-500">{p.name}: <span className="font-semibold text-gray-900">{p.value}</span></p>
      ))}
    </div>
  )
}

export default function Compare() {
  const [hotels, setHotels] = useState(getCompare)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setHotels(getCompare())
    setLoading(false)
  }, [])

  const removeHotel = (id) => {
    const updated = hotels.filter((h) => h.id !== id)
    setHotels(updated)
    localStorage.setItem('luxstay_compare', JSON.stringify(updated))
  }

  if (hotels.length < 2) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 gap-4">
        <div className="text-3xl">⚖️</div>
        <p className="text-sm text-gray-500 text-center">
          {hotels.length === 1 ? 'Select 1 more hotel to start comparing.' : 'Select at least 2 hotels from search to compare.'}
        </p>
        <a href="/search" className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors">
          Back to search
        </a>
      </div>
    )
  }

  const priceData = hotels.map((h) => ({
    name: shortName(h.name),
    Price: h.exactPrice ?? (parseFloat((h.price ?? '').replace(/[^0-9.]/g, '')) || 0),
  }))

  const avgPrice = Math.round(priceData.reduce((s, d) => s + d.Price, 0) / priceData.length)

  const ratingData = hotels.map((h) => ({
    name: shortName(h.name),
    'Guest Rating': Number(h.guestRating ?? 0),
    'Star Class': Number(h.starRating ?? 0),
  }))

  // Amenities: find shared vs unique
  const amenitySets = hotels.map((h) => new Set(h.amenities ?? []))
  const sharedAmenities = [...(amenitySets[0] ?? [])].filter((a) =>
    amenitySets.every((s) => s.has(a))
  )

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <a href="/" className="text-base font-bold tracking-tight text-slate-900">Lux<span className="text-amber-500">Stay</span></a>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { localStorage.removeItem('luxstay_compare'); setHotels([]) }}
            className="text-sm px-4 py-2 border border-stone-200 rounded-xl text-slate-600 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            Clear all
          </button>
          <a href="/search" className="text-sm text-slate-400 hover:text-slate-900 transition-colors">← Back to search</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Compare Hotels</h1>
        <p className="text-sm text-gray-400 mb-8">{hotels.length} hotels selected</p>

        {/* Hotel summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {hotels.map((hotel, idx) => (
            <div key={hotel.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {hotel.image ? (
                <img src={hotel.image} alt={hotel.name} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">No image</span>
                </div>
              )}
              {/* Color band per hotel */}
              <div className="h-1" style={{ backgroundColor: BAR_COLORS[idx] }} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug">{hotel.name}</h3>
                  <button onClick={() => removeHotel(hotel.id)} className="shrink-0 text-gray-300 hover:text-gray-700 transition-colors text-xl leading-none">×</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{hotel.price}<span className="text-xs font-normal text-gray-400"> /night</span></span>
                  <div className="flex items-center gap-1.5">
                    {hotel.starRating > 0 && <span className="text-xs text-amber-400">{'★'.repeat(Math.min(hotel.starRating, 5))}</span>}
                    {hotel.guestRating && <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg">{hotel.guestRating}</span>}
                  </div>
                </div>
                {hotel.freeCancellation && (
                  <span className="inline-block mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">Free cancellation</span>
                )}
                {hotel.deal && (
                  <p className="mt-1.5 text-xs text-blue-700">{hotel.deal}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Price Chart ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Price Comparison</h2>
              <p className="text-xs text-gray-400 mt-0.5">Nightly rate in USD · avg ${avgPrice}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceData} margin={{ top: 24, right: 16, bottom: 0, left: 0 }} barSize={52}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<PriceTooltip />} cursor={{ fill: '#f9fafb' }} />
              <ReferenceLine y={avgPrice} stroke="#e5e7eb" strokeDasharray="5 5" label={{ value: `avg $${avgPrice}`, position: 'insideTopRight', fontSize: 10, fill: '#9ca3af', dy: -6 }} />
              <Bar dataKey="Price" radius={[8, 8, 0, 0]}>
                {priceData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i]} />)}
                <LabelList dataKey="Price" position="top" formatter={(v) => `$${v}`} style={{ fontSize: 11, fontWeight: 700, fill: '#374151' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Rating Chart ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-0.5">Rating Comparison</h2>
          <p className="text-xs text-gray-400 mb-4">Guest rating (0–5) vs Star class (0–5)</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ratingData} barGap={6} barCategoryGap="35%" margin={{ top: 20, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<RatingTooltip />} cursor={{ fill: '#f9fafb' }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
              <Bar dataKey="Guest Rating" fill="#111827" radius={[6, 6, 0, 0]} barSize={30}>
                <LabelList dataKey="Guest Rating" position="top" style={{ fontSize: 10, fontWeight: 600, fill: '#374151' }} />
              </Bar>
              <Bar dataKey="Star Class" fill="#d1d5db" radius={[6, 6, 0, 0]} barSize={30}>
                <LabelList dataKey="Star Class" position="top" style={{ fontSize: 10, fontWeight: 600, fill: '#6b7280' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Side-by-side table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Side-by-side</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left pb-3 pr-6 text-xs text-gray-400 font-medium w-36">Attribute</th>
                  {hotels.map((h, i) => (
                    <th key={h.id} className="text-left pb-3 pr-6 text-xs font-semibold text-gray-900">
                      <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ backgroundColor: BAR_COLORS[i] }} />
                      {h.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Price / night', render: (h) => <span className="font-semibold">{h.price ?? '—'}</span> },
                  { label: 'Star class', render: (h) => h.starRating ? <span className="text-amber-400">{'★'.repeat(Math.min(h.starRating, 5))}</span> : '—' },
                  { label: 'Guest rating', render: (h) => h.guestRating ? `${h.guestRating} / 5` : '—' },
                  { label: 'Reviews', render: (h) => h.reviewCount ? h.reviewCount.toLocaleString() : '—' },
                  { label: 'Free cancellation', render: (h) => h.freeCancellation ? <span className="text-emerald-600 font-medium">Yes</span> : <span className="text-gray-400">No</span> },
                  { label: 'Deal', render: (h) => h.deal ? <span className="text-blue-600">{h.deal}</span> : '—' },
                ].map(({ label, render }) => (
                  <tr key={label} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-6 text-xs text-gray-400 font-medium">{label}</td>
                    {hotels.map((h) => (
                      <td key={h.id} className="py-3 pr-6 text-xs text-gray-900">{render(h)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Shared amenities ── */}
        {sharedAmenities.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Shared Amenities</h2>
            <p className="text-xs text-gray-400 mb-4">Available at all {hotels.length} selected hotels</p>
            <div className="flex flex-wrap gap-2">
              {sharedAmenities.map((a) => (
                <span key={a} className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-gray-600">{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── Per-hotel amenities ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-4">All Amenities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((h, idx) => (
              <div key={h.id}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: BAR_COLORS[idx] }} />
                  <p className="text-xs font-semibold text-gray-700 truncate">{h.name}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(h.amenities ?? []).length > 0
                    ? h.amenities.map((a) => (
                        <span key={a} className={`text-xs rounded-full px-2.5 py-1 ${sharedAmenities.includes(a) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>{a}</span>
                      ))
                    : <span className="text-xs text-gray-400">No data</span>
                  }
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">Dark = shared across all hotels</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => { localStorage.removeItem('luxstay_compare'); window.location.href = '/search' }}
            className="text-sm text-gray-400 hover:text-gray-700 underline transition-colors"
          >
            Clear selection
          </button>
        </div>
      </main>
    </div>
  )
}
