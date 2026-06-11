import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LabelList, Cell, ReferenceLine,
  RadialBarChart, RadialBar,
} from 'recharts'

function getCompare() {
  try { return JSON.parse(localStorage.getItem('luxstay_compare') ?? '[]') } catch { return [] }
}

function shortName(name = '') {
  return name.length > 22 ? name.slice(0, 20) + '…' : name
}

// Distinct color per hotel — indigo / amber / emerald
const HOTEL_COLORS = [
  { bar: '#6366f1', light: '#eef2ff', text: '#4338ca', gradient: 'from-indigo-500 to-indigo-400' },
  { bar: '#f59e0b', light: '#fffbeb', text: '#b45309', gradient: 'from-amber-500 to-amber-400' },
  { bar: '#10b981', light: '#ecfdf5', text: '#047857', gradient: 'from-emerald-500 to-emerald-400' },
]

/* ── Tooltips ───────────────────────────────────────────── */
function PriceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const idx = payload[0]?.payload?.__idx ?? 0
  const c = HOTEL_COLORS[idx] ?? HOTEL_COLORS[0]
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-1 max-w-[160px] truncate">{label}</p>
      <p className="text-xl font-bold" style={{ color: c.bar }}>
        ${payload[0].value}
        <span className="text-xs font-normal text-gray-400 ml-1">/night</span>
      </p>
    </div>
  )
}

function RatingTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  const c = HOTEL_COLORS[d?.__idx ?? 0] ?? HOTEL_COLORS[0]
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-1 max-w-[160px] truncate">{d?.name}</p>
      <p className="text-xl font-bold" style={{ color: c.bar }}>
        {d?.value} <span className="text-xs font-normal text-gray-400">/ 5</span>
      </p>
    </div>
  )
}

/* ── Value-score progress bar ───────────────────────────── */
function ScoreBar({ label, value, max, color, suffix = '' }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0)
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500 truncate max-w-[60%]">{label}</span>
        <span className="text-xs font-bold text-gray-800">{value}{suffix}</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

/* ── Main ───────────────────────────────────────────────── */
export default function Compare() {
  const [hotels, setHotels] = useState(getCompare)

  useEffect(() => { setHotels(getCompare()) }, [])

  const removeHotel = (id) => {
    const updated = hotels.filter((h) => h.id !== id)
    setHotels(updated)
    localStorage.setItem('luxstay_compare', JSON.stringify(updated))
  }

  if (hotels.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 gap-4">
        <div className="text-4xl">⚖️</div>
        <p className="text-sm text-gray-500 text-center font-medium">
          {hotels.length === 1 ? 'Select 1 more hotel to start comparing.' : 'Select at least 2 hotels from search to compare.'}
        </p>
        <a href="/search" className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors">
          Back to search
        </a>
      </div>
    )
  }

  /* ── Data ── */
  const priceData = hotels.map((h, i) => ({
    name: shortName(h.name),
    Price: h.exactPrice ?? (parseFloat((h.price ?? '').replace(/[^0-9.]/g, '')) || 0),
    __idx: i,
  }))
  const avgPrice = Math.round(priceData.reduce((s, d) => s + d.Price, 0) / priceData.length)
  const maxPrice = Math.max(...priceData.map(d => d.Price))

  const radialData = hotels.map((h, i) => ({
    name: shortName(h.name),
    value: Number(h.guestRating ?? 0),
    fill: HOTEL_COLORS[i].bar,
    __idx: i,
  })).reverse() // RadialBarChart renders outer→inner

  const amenitySets = hotels.map((h) => new Set(h.amenities ?? []))
  const sharedAmenities = [...(amenitySets[0] ?? [])].filter((a) =>
    amenitySets.every((s) => s.has(a))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <a href="/" className="text-base font-semibold tracking-tight text-gray-900">LuxStay</a>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { localStorage.removeItem('luxstay_compare'); setHotels([]) }}
            className="text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            Clear all
          </button>
          <a href="/search" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Back</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Compare Hotels</h1>
        <p className="text-sm text-gray-400 mb-8">{hotels.length} hotels selected</p>

        {/* ── Hotel cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {hotels.map((hotel, idx) => {
            const c = HOTEL_COLORS[idx]
            return (
              <div key={hotel.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                {hotel.image ? (
                  <img src={hotel.image} alt={hotel.name} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                    <span className="text-3xl">🏨</span>
                  </div>
                )}
                <div className="h-1.5" style={{ backgroundColor: c.bar }} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.bar }} />
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug">{hotel.name}</h3>
                    </div>
                    <button onClick={() => removeHotel(hotel.id)} className="shrink-0 text-gray-300 hover:text-gray-700 transition-colors text-xl leading-none">×</button>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-900">{hotel.price}<span className="text-xs font-normal text-gray-400"> /night</span></span>
                    <div className="flex items-center gap-1.5">
                      {hotel.starRating > 0 && <span className="text-xs text-amber-400">{'★'.repeat(Math.min(hotel.starRating, 5))}</span>}
                      {hotel.guestRating && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ backgroundColor: c.light, color: c.text }}>
                          {hotel.guestRating}★
                        </span>
                      )}
                    </div>
                  </div>
                  {hotel.freeCancellation && (
                    <span className="inline-block text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">Free cancellation</span>
                  )}
                  {hotel.deal && <p className="mt-1.5 text-xs font-medium" style={{ color: c.text }}>{hotel.deal}</p>}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Charts row: Price + Rating side by side ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Price — horizontal bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-0.5">Price / Night</h2>
            <p className="text-xs text-gray-400 mb-5">USD · avg <span className="font-semibold text-gray-600">${avgPrice}</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={priceData}
                layout="vertical"
                margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
                barSize={22}
              >
                <defs>
                  {HOTEL_COLORS.map((c, i) => (
                    <linearGradient key={i} id={`priceGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={c.bar} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={c.bar} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<PriceTooltip />} cursor={{ fill: '#f9fafb' }} />
                <ReferenceLine x={avgPrice} stroke="#e5e7eb" strokeDasharray="4 4" />
                <Bar dataKey="Price" radius={[0, 8, 8, 0]}>
                  {priceData.map((_, i) => (
                    <Cell key={i} fill={`url(#priceGrad${i})`} />
                  ))}
                  <LabelList dataKey="Price" position="right" formatter={(v) => `$${v}`} style={{ fontSize: 11, fontWeight: 700, fill: '#374151' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Guest Rating — RadialBarChart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-0.5">Guest Rating</h2>
            <p className="text-xs text-gray-400 mb-2">Score out of 5</p>
            <div className="relative">
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="90%"
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                  barSize={18}
                >
                  <defs>
                    {HOTEL_COLORS.map((c, i) => (
                      <linearGradient key={i} id={`radialGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={c.bar} />
                        <stop offset="100%" stopColor={c.bar} stopOpacity={0.6} />
                      </linearGradient>
                    ))}
                  </defs>
                  <RadialBar
                    dataKey="value"
                    background={{ fill: '#f3f4f6' }}
                    cornerRadius={8}
                    max={5}
                  >
                    {radialData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </RadialBar>
                  <Tooltip content={<RatingTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
              {/* Legend below */}
              <div className="flex justify-center gap-4 mt-1">
                {[...hotels].reverse().map((h, i) => {
                  const realIdx = hotels.length - 1 - i
                  const c = HOTEL_COLORS[realIdx]
                  return (
                    <div key={h.id} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.bar }} />
                      <span className="text-xs text-gray-500 truncate max-w-[80px]">{shortName(h.name)}</span>
                      <span className="text-xs font-bold" style={{ color: c.bar }}>{h.guestRating ?? '—'}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Value score bars ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Value at a Glance</h2>
          <p className="text-xs text-gray-400 mb-6">Price, guest rating, and review count compared side by side</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {hotels.map((h, idx) => {
              const c = HOTEL_COLORS[idx]
              return (
                <div key={h.id} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.bar }} />
                    <p className="text-xs font-semibold text-gray-700 truncate">{h.name}</p>
                  </div>
                  <ScoreBar label="Price / night" value={h.exactPrice ?? 0} max={maxPrice} color={c.bar} suffix=" USD" />
                  <ScoreBar label="Guest rating" value={Number(h.guestRating ?? 0)} max={5} color={c.bar} suffix=" / 5" />
                  <ScoreBar label="Star class" value={Number(h.starRating ?? 0)} max={5} color={c.bar} suffix=" ★" />
                  {h.reviewCount > 0 && (
                    <ScoreBar label="Reviews" value={h.reviewCount} max={Math.max(...hotels.map(x => x.reviewCount ?? 0))} color={c.bar} />
                  )}
                </div>
              )
            })}
          </div>
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
                      <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ backgroundColor: HOTEL_COLORS[i].bar }} />
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

        {/* ── Amenities ── */}
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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-4">All Amenities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((h, idx) => {
              const c = HOTEL_COLORS[idx]
              return (
                <div key={h.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.bar }} />
                    <p className="text-xs font-semibold text-gray-700 truncate">{h.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(h.amenities ?? []).length > 0
                      ? h.amenities.map((a) => (
                          <span
                            key={a}
                            className="text-xs rounded-full px-2.5 py-1"
                            style={sharedAmenities.includes(a)
                              ? { backgroundColor: c.bar, color: '#fff' }
                              : { backgroundColor: c.light, color: c.text }}
                          >
                            {a}
                          </span>
                        ))
                      : <span className="text-xs text-gray-400">No data</span>
                    }
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-4">Filled = shared across all hotels</p>
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
