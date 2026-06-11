import StarRating from './StarRating'

export default function HotelCard({ hotel, isSelected, onToggle }) {
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        isSelected
          ? 'border-2 border-gray-900 shadow-md'
          : 'border border-gray-200 shadow-sm hover:border-gray-300'
      }`}
      onClick={() => {
        sessionStorage.setItem('luxstay_hotel', JSON.stringify(hotel))
        window.location.href = `/hotel/${encodeURIComponent(hotel.id)}`
      }}
    >
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden">
        {hotel.image ? (
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-3xl text-gray-300">🏨</span>
          </div>
        )}
        {hotel.deal && (
          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {hotel.deal}
          </span>
        )}
        <div
          className="absolute top-3 right-3"
          onClick={(e) => { e.stopPropagation(); onToggle() }}
        >
          <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer shadow-sm ${
            isSelected ? 'bg-gray-900 border-gray-900' : 'bg-white/90 border-gray-300 hover:border-gray-600'
          }`}>
            {isSelected && <span className="text-white text-xs font-bold">✓</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1.5 line-clamp-2">{hotel.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <StarRating count={hotel.starRating} />
          {hotel.guestRating && (
            <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">
              {hotel.guestRating} / 5
            </span>
          )}
          {hotel.reviewCount && (
            <span className="text-xs text-gray-400">{hotel.reviewCount.toLocaleString()} reviews</span>
          )}
        </div>
        {hotel.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">{hotel.description}</p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-gray-900">{hotel.price}</span>
            <span className="text-xs text-gray-400">/ night</span>
          </div>
          {hotel.freeCancellation && (
            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Free cancel</span>
          )}
        </div>
      </div>
    </div>
  )
}
