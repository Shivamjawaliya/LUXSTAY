import { useState, useEffect, useRef } from 'react'
import { searchHotels, autocomplete } from '../services/hotelsClient'
import { useAuth } from '../context/AuthContext'

function getCompare() {
  try { return JSON.parse(localStorage.getItem('luxstay_compare') ?? '[]') } catch { return [] }
}
function saveCompare(arr) {
  localStorage.setItem('luxstay_compare', JSON.stringify(arr))
}

export default function Search() {
  const { user } = useAuth()
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const fmt = (d) => d.toISOString().split('T')[0]

  const [city, setCity] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestRef = useRef(null)
  const debounceRef = useRef(null)

  const [checkIn, setCheckIn] = useState(fmt(today))
  const [checkOut, setCheckOut] = useState(fmt(tomorrow))
  const [adults, setAdults] = useState(2)

  const [hotels, setHotels] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [nextPageToken, setNextPageToken] = useState(null)
  const [searchCity, setSearchCity] = useState('')

  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const [selected, setSelected] = useState(getCompare)
  const [compareError, setCompareError] = useState(null)

  useEffect(() => { saveCompare(selected) }, [selected])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (city.length < 2) { setSuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await autocomplete(city)
        setSuggestions(results.slice(0, 6))
        setShowSuggestions(results.length > 0)
      } catch {
        setSuggestions([])
      }
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [city])

  useEffect(() => {
    const handler = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!city.trim()) return
    setLoading(true)
    setError(null)
    setHotels([])
    setNextPageToken(null)
    setSearched(true)
    try {
      localStorage.setItem('luxstay_dates', JSON.stringify({ checkIn, checkOut, adults }))
      const { hotels: results, totalCount: total, nextPageToken: token } = await searchHotels({
        city: city.trim(), checkIn, checkOut, adults,
      })
      setHotels(results)
      setTotalCount(total)
      setNextPageToken(token)
      setSearchCity(city.trim())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (!nextPageToken) return
    setLoadingMore(true)
    setError(null)
    try {
      const { hotels: more, nextPageToken: token } = await searchHotels({
        city: searchCity, checkIn, checkOut, adults, nextPageToken,
      })
      setHotels((prev) => [...prev, ...more])
      setNextPageToken(token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingMore(false)
    }
  }

  const toggleSelect = (hotel) => {
    setCompareError(null)
    const exists = selected.find((h) => h.id === hotel.id)
    if (exists) {
      setSelected((prev) => prev.filter((h) => h.id !== hotel.id))
    } else {
      if (selected.length >= 3) {
        setCompareError('You can compare up to 3 hotels only.')
        return
      }
      setSelected((prev) => [...prev, hotel])
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button onClick={() => window.location.href = '/'} className="text-base font-semibold tracking-tight text-gray-900">
          LuxStay
        </button>
        <div className="flex items-center gap-3">
          {selected.length >= 2 && (
            <button
              onClick={() => window.location.href = '/compare'}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Compare ({selected.length})
            </button>
          )}
          <button
            onClick={() => window.location.href = '/profile'}
            title={user?.email ?? 'Profile'}
            className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-semibold flex items-center justify-center hover:bg-gray-700 transition-colors shrink-0"
          >
            {(user?.email ?? '?').slice(0, 2).toUpperCase()}
          </button>
        </div>
      </header>

      {/* Filter bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1 relative" ref={suggestRef}>
            <label className="text-xs text-gray-400">City or destination</label>
            <input
              type="text"
              placeholder="e.g. Bali Resorts"
              value={city}
              onChange={(e) => { setCity(e.target.value); setShowSuggestions(true) }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onKeyDown={(e) => e.key === 'Escape' && setShowSuggestions(false)}
              required
              autoComplete="off"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 w-52"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full mt-1 left-0 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {suggestions.map((s, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        const label = s.value ?? s.name ?? s.description ?? ''
                        setCity(label)
                        setShowSuggestions(false)
                        setSuggestions([])
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-start gap-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-gray-300 mt-0.5 shrink-0">
                        {s.type === 'hotel' ? '🏨' : '📍'}
                      </span>
                      <span className="leading-snug">{s.value ?? s.name ?? s.description}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Check-in</label>
            <input
              type="date"
              value={checkIn}
              min={fmt(today)}
              onChange={(e) => setCheckIn(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Check-out</label>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Guests</label>
            <input
              type="number"
              min={1}
              max={10}
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-gray-400 w-20"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
      </div>

      {/* Main content */}
      <main className="px-6 py-8 max-w-5xl mx-auto">

        {selected.length === 1 && (
          <p className="mb-4 text-xs text-gray-400">Select 1 more hotel to enable comparison.</p>
        )}

        {compareError && (
          <div className="mb-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
            {compareError}
          </div>
        )}

        {error && (
          <div className="mb-6 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-red-500">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden animate-pulse">
                <div className="bg-gray-100 h-44 w-full" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="bg-gray-100 h-4 rounded w-3/4" />
                  <div className="bg-gray-100 h-3 rounded w-1/2" />
                  <div className="bg-gray-100 h-3 rounded w-1/4 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && hotels.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-4">{totalCount.toLocaleString()} hotels found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  isSelected={!!selected.find((h) => h.id === hotel.id)}
                  onToggle={() => toggleSelect(hotel)}
                />
              ))}
            </div>

            {nextPageToken && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  {loadingMore ? 'Loading…' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}

        {!loading && searched && hotels.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-sm text-gray-400">No hotels found. Try a different search.</p>
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center py-20">
            <p className="text-sm text-gray-400">Enter a destination above to start searching.</p>
          </div>
        )}
      </main>
    </div>
  )
}

function StarRating({ count }) {
  if (!count) return null
  const full = Math.floor(Math.min(count, 5))
  return (
    <span className="text-gray-400 text-xs">
      {'★'.repeat(full)}{'☆'.repeat(Math.max(0, 5 - full))}
    </span>
  )
}

function HotelCard({ hotel, isSelected, onToggle }) {
  return (
    <div
      className={`border rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer ${
        isSelected ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200'
      }`}
      onClick={() => {
        sessionStorage.setItem('luxstay_hotel', JSON.stringify(hotel))
        window.location.href = `/hotel/${encodeURIComponent(hotel.id)}`
      }}
    >
      {hotel.image ? (
        <img src={hotel.image} alt={hotel.name} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
          <span className="text-xs text-gray-400">No image</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => { e.stopPropagation(); onToggle() }}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 accent-gray-900 shrink-0"
          />
          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{hotel.name}</h3>
        </div>

        {hotel.description && (
          <p className="text-xs text-gray-400 mt-1 ml-5 line-clamp-2">{hotel.description}</p>
        )}

        <div className="flex items-center gap-3 mt-2 ml-5">
          <StarRating count={hotel.starRating} />
          {hotel.guestRating && (
            <span className="text-xs font-medium text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
              {hotel.guestRating}★
            </span>
          )}
          {hotel.reviewCount && (
            <span className="text-xs text-gray-400">{hotel.reviewCount.toLocaleString()} reviews</span>
          )}
        </div>

        {hotel.deal && (
          <p className="text-xs text-green-700 mt-1 ml-5">{hotel.deal}</p>
        )}

        <div className="mt-3 ml-5 flex items-baseline gap-1">
          <span className="text-base font-semibold text-gray-900">{hotel.price}</span>
          <span className="text-xs text-gray-400">/ night</span>
          {hotel.freeCancellation && (
            <span className="ml-2 text-xs text-gray-400">· Free cancellation</span>
          )}
        </div>
      </div>
    </div>
  )
}
