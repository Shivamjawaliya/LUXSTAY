import { useState } from 'react'

function getDates() {
  try { return JSON.parse(localStorage.getItem('luxstay_dates') ?? '{}') } catch { return {} }
}

function getCachedHotel() {
  try { return JSON.parse(sessionStorage.getItem('luxstay_hotel') ?? 'null') } catch { return null }
}

export default function HotelDetail() {
  const hotel = getCachedHotel()
  const [activeImg, setActiveImg] = useState(0)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <button onClick={() => window.location.href = '/'} className="text-base font-semibold tracking-tight text-gray-900">LuxStay</button>
        <button onClick={() => window.history.back()} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Back</button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {!hotel ? (
          <div className="text-center py-20">
            <p className="text-sm text-gray-400">Hotel not found. Please go back and click a hotel card.</p>
            <button onClick={() => window.history.back()} className="mt-4 text-sm text-gray-500 underline">Go back</button>
          </div>
        ) : (
          <HotelView hotel={hotel} activeImg={activeImg} setActiveImg={setActiveImg} />
        )}
      </main>
    </div>
  )
}

function HotelView({ hotel, activeImg, setActiveImg }) {
  const dates = getDates()
  const images = hotel.images ?? (hotel.image ? [{ thumbnail: hotel.image, original_image: hotel.image }] : [])

  return (
    <div>
      {/* Image gallery */}
      {images.length > 0 ? (
        <div className="mb-8">
          <div className="rounded-xl overflow-hidden h-72 bg-gray-100 mb-2">
            <img
              src={images[activeImg]?.original_image ?? images[activeImg]?.thumbnail}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.slice(0, 10).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-gray-900' : 'border-transparent'}`}
                >
                  <img src={img.thumbnail} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-gray-100 h-72 flex items-center justify-center mb-8">
          <span className="text-sm text-gray-400">No images available</span>
        </div>
      )}

      {/* Name + rating */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl font-semibold text-gray-900 leading-snug">{hotel.name}</h1>
        {hotel.guestRating && (
          <div className="shrink-0 text-right">
            <p className="text-xl font-semibold text-gray-900">{hotel.guestRating}<span className="text-sm font-normal text-gray-400">/5</span></p>
            {hotel.reviewCount && <p className="text-xs text-gray-400">{hotel.reviewCount.toLocaleString()} reviews</p>}
          </div>
        )}
      </div>

      {/* Stars */}
      {hotel.starRating > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-400">{'★'.repeat(Math.min(hotel.starRating, 5))}</span>
          <span className="text-xs text-gray-400">{hotel.starRating}-star hotel</span>
        </div>
      )}

      {/* Description */}
      {hotel.description && (
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{hotel.description}</p>
      )}

      {/* Price block */}
      <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-50 rounded-xl mb-8">
        <div>
          <p className="text-2xl font-semibold text-gray-900">{hotel.price}</p>
          <p className="text-xs text-gray-400">per night</p>
        </div>
        {dates.checkIn && dates.checkOut && (
          <div className="text-xs text-gray-500">
            <p>{dates.checkIn} → {dates.checkOut}</p>
            <p>{dates.adults ?? 2} guest{(dates.adults ?? 2) > 1 ? 's' : ''}</p>
          </div>
        )}
        {hotel.checkInTime && (
          <div className="text-xs text-gray-500">
            <p>Check-in: {hotel.checkInTime}</p>
            {hotel.checkOutTime && <p>Check-out: {hotel.checkOutTime}</p>}
          </div>
        )}
        {hotel.freeCancellation && (
          <span className="text-xs text-gray-600 border border-gray-200 rounded-full px-3 py-1">Free cancellation</span>
        )}
        {hotel.deal && (
          <span className="text-xs text-green-700 border border-green-200 bg-green-50 rounded-full px-3 py-1">{hotel.deal}</span>
        )}
      </div>

      {/* Amenities */}
      {hotel.amenities?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.map((a, i) => (
              <span key={i} className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-gray-600">{a}</span>
            ))}
          </div>
        </section>
      )}

      {/* Ratings breakdown */}
      {hotel.ratingsBreakdown?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Guest Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hotel.ratingsBreakdown.map((r, i) => {
              const pct = r.total_mentioned > 0 ? Math.round((r.positive / r.total_mentioned) * 100) : 0
              return (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">{r.name}</span>
                    <span className="text-xs text-gray-400">{pct}% positive</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-gray-700 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{r.total_mentioned} mentions</p>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Nearby places */}
      {hotel.nearbyPlaces?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-3">What's nearby</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {hotel.nearbyPlaces.map((p, i) => (
              <li key={i} className="border border-gray-100 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-gray-700">{p.name}</p>
                {p.transportations?.map((t, j) => (
                  <p key={j} className="text-xs text-gray-400">{t.type} · {t.duration}</p>
                ))}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* External link */}
      {hotel.link && (
        <div className="mt-4">
          <a
            href={hotel.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            View on official site →
          </a>
        </div>
      )}
    </div>
  )
}
