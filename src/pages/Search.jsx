import { useState, useEffect, useRef } from 'react'
import { searchHotels } from '../services/hotelsClient'
import { useAuth } from '../context/AuthContext'
import HotelCard from '../components/HotelCard'
import CompareTray from '../components/CompareTray'

const DESTINATIONS = [
  'Amsterdam', 'Athens', 'Atlanta', 'Auckland', 'Bali', 'Bangkok', 'Barcelona',
  'Beijing', 'Berlin', 'Bora Bora', 'Boston', 'Brussels', 'Budapest', 'Buenos Aires',
  'Cairo', 'Cancun', 'Cape Town', 'Chicago', 'Copenhagen', 'Dallas', 'Delhi',
  'Denver', 'Dubai', 'Dublin', 'Edinburgh', 'Florence', 'Frankfurt', 'Geneva',
  'Hawaii', 'Helsinki', 'Hong Kong', 'Honolulu', 'Istanbul', 'Jakarta', 'Johannesburg',
  'Kuala Lumpur', 'Kyoto', 'Lagos', 'Las Vegas', 'Lisbon', 'London', 'Los Angeles',
  'Madrid', 'Maldives', 'Manchester', 'Manila', 'Marrakech', 'Melbourne', 'Mexico City',
  'Miami', 'Milan', 'Montreal', 'Moscow', 'Mumbai', 'Munich', 'Nairobi', 'Naples',
  'New York', 'Nice', 'Osaka', 'Oslo', 'Paris', 'Prague', 'Rio de Janeiro', 'Rome',
  'San Francisco', 'Santiago', 'São Paulo', 'Santorini', 'Seoul', 'Shanghai', 'Singapore',
  'Stockholm', 'Sydney', 'Taipei', 'Tel Aviv', 'Tokyo', 'Toronto', 'Vancouver',
  'Venice', 'Vienna', 'Warsaw', 'Washington DC', 'Zurich',
]

function getSuggestions(query) {
  if (!query || query.length < 1) return []
  const q = query.toLowerCase()
  return DESTINATIONS.filter((d) => d.toLowerCase().startsWith(q)).slice(0, 6)
}

function getCompare() {
  try { return JSON.parse(localStorage.getItem('luxstay_compare') ?? '[]') } catch { return [] }
}
function saveCompare(arr) {
  localStorage.setItem('luxstay_compare', JSON.stringify(arr))
}
function getLastSearch() {
  try { return JSON.parse(localStorage.getItem('luxstay_last_search') ?? 'null') } catch { return null }
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
    setSuggestions(getSuggestions(city))
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

  // On mount: if ?fresh=1 (coming from landing), always show London.
  // Otherwise restore the last search so back-navigation feels instant.
  useEffect(() => {
    const fresh = new URLSearchParams(window.location.search).get('fresh') === '1'
    if (fresh) {
      window.history.replaceState({}, '', '/search')
      runSearch({ cityVal: 'London', checkInVal: fmt(today), checkOutVal: fmt(tomorrow), adultsVal: 2 })
      return
    }
    const last = getLastSearch()
    if (last && last.hotels?.length > 0) {
      setCity(last.city)
      setCheckIn(last.checkIn)
      setCheckOut(last.checkOut)
      setAdults(last.adults)
      setHotels(last.hotels)
      setTotalCount(last.totalCount ?? 0)
      setNextPageToken(last.nextPageToken ?? null)
      setSearchCity(last.city)
      setSearched(true)
    } else {
      runSearch({ cityVal: 'London', checkInVal: fmt(today), checkOutVal: fmt(tomorrow), adultsVal: 2 })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const runSearch = async ({ cityVal, checkInVal, checkOutVal, adultsVal }) => {
    console.log(`[Search] searching: city=${cityVal} checkIn=${checkInVal} checkOut=${checkOutVal} adults=${adultsVal}`)
    setLoading(true)
    setError(null)
    setHotels([])
    setNextPageToken(null)
    setCity(cityVal)
    try {
      setSearched(true)
      localStorage.setItem('luxstay_dates', JSON.stringify({ checkIn: checkInVal, checkOut: checkOutVal, adults: adultsVal }))
      const { hotels: results, totalCount: total, nextPageToken: token } = await searchHotels({
        city: cityVal, checkIn: checkInVal, checkOut: checkOutVal, adults: adultsVal,
      })
      console.log(`[Search] results: ${results.length} hotels returned, total=${total}`)
      setHotels(results)
      setTotalCount(total)
      setNextPageToken(token)
      setSearchCity(cityVal)
      localStorage.setItem('luxstay_last_search', JSON.stringify({
        city: cityVal, checkIn: checkInVal, checkOut: checkOutVal, adults: adultsVal,
        hotels: results, totalCount: total, nextPageToken: token,
      }))
    } catch (err) {
      console.error('[Search] search error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!city.trim()) return
    await runSearch({ cityVal: city.trim(), checkInVal: checkIn, checkOutVal: checkOut, adultsVal: adults })
  }

  const handleLoadMore = async () => {
    if (!nextPageToken) return
    console.log(`[Search] load more: city=${searchCity} page token=${nextPageToken}`)
    setLoadingMore(true)
    setError(null)
    try {
      const { hotels: more, nextPageToken: token } = await searchHotels({
        city: searchCity, checkIn, checkOut, adults, nextPageToken,
      })
      console.log(`[Search] load more: ${more.length} additional hotels loaded`)
      const merged = [...hotels, ...more]
      setHotels(merged)
      setNextPageToken(token)
      localStorage.setItem('luxstay_last_search', JSON.stringify({
        city: searchCity, checkIn, checkOut, adults,
        hotels: merged, totalCount, nextPageToken: token,
      }))
    } catch (err) {
      console.error('[Search] load more error:', err.message)
      setError(err.message)
    } finally {
      setLoadingMore(false)
    }
  }

  const toggleSelect = (hotel) => {
    setCompareError(null)
    const exists = selected.find((h) => h.id === hotel.id)
    if (exists) {
      console.log(`[Compare] removed: ${hotel.name}`)
      setSelected((prev) => prev.filter((h) => h.id !== hotel.id))
    } else {
      if (selected.length >= 3) {
        console.warn('[Compare] max 3 hotels reached')
        setCompareError('You can compare up to 3 hotels only.')
        return
      }
      console.log(`[Compare] added: ${hotel.name} (${selected.length + 1}/3)`)
      setSelected((prev) => [...prev, hotel])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <button onClick={() => window.location.href = '/'} className="text-base font-semibold tracking-tight text-gray-900">LuxStay</button>
        <div className="flex items-center gap-3">
          {selected.length >= 2 && (
            <button
              onClick={() => window.location.href = '/compare'}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
            >
              ⚖️ Compare ({selected.length})
            </button>
          )}
          {selected.length === 1 && (
            <span className="text-xs text-gray-400 hidden sm:block">Select 1 more to compare</span>
          )}
          <button
            onClick={() => window.location.href = '/profile'}
            title={user?.email ?? 'Profile'}
            className="w-9 h-9 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center hover:bg-gray-700 transition-colors shrink-0 shadow-sm"
          >
            {(user?.email ?? '?').slice(0, 2).toUpperCase()}
          </button>
        </div>
      </header>

      {/* Filter bar */}
      <div className="sticky top-[57px] z-10 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1 relative" ref={suggestRef}>
            <label className="text-xs font-medium text-gray-400">Destination</label>
            <input
              type="text"
              placeholder="e.g. London, Bali…"
              value={city}
              onChange={(e) => { setCity(e.target.value); setShowSuggestions(true) }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onKeyDown={(e) => e.key === 'Escape' && setShowSuggestions(false)}
              required
              autoComplete="off"
              className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 w-52 transition-all"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full mt-1.5 left-0 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                {suggestions.map((s, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); setCity(s); setShowSuggestions(false); setSuggestions([]) }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                    >
                      <span>{s}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400">Check-in</label>
            <input type="date" value={checkIn} min={fmt(today)} onChange={(e) => setCheckIn(e.target.value)}
              className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400">Check-out</label>
            <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)}
              className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400">Guests</label>
            <input type="number" min={1} max={10} value={adults} onChange={(e) => setAdults(Number(e.target.value))}
              className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 w-20 transition-all" />
          </div>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-colors shadow-sm">
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
      </div>

      {/* Compare tray */}
      {selected.length > 0 && (
        <CompareTray selected={selected} onRemove={toggleSelect} />
      )}

      {/* Main content */}
      <main className="px-8 py-8">

        {compareError && (
          <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            {compareError}
          </div>
        )}

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse shadow-sm">
                <div className="bg-gray-100 h-48 w-full" />
                <div className="p-4 flex flex-col gap-2.5">
                  <div className="bg-gray-100 h-4 rounded-lg w-3/4" />
                  <div className="bg-gray-100 h-3 rounded-lg w-1/2" />
                  <div className="bg-gray-100 h-3 rounded-lg w-1/4 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && hotels.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-5 font-medium">{totalCount.toLocaleString()} hotels found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
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
              <div className="mt-10 flex justify-center">
                <button onClick={handleLoadMore} disabled={loadingMore}
                  className="px-8 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm">
                  {loadingMore ? 'Loading…' : 'Load more results'}
                </button>
              </div>
            )}
          </>
        )}

        {!loading && searched && hotels.length === 0 && !error && (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-sm text-gray-500 font-medium">No hotels found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different destination or dates</p>
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🏨</p>
            <p className="text-sm text-gray-500 font-medium">Where are you headed?</p>
            <p className="text-xs text-gray-400 mt-1">Enter a destination above to start searching</p>
          </div>
        )}
      </main>
    </div>
  )
}

