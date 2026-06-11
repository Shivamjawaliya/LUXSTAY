export default function CompareTray({ selected, onRemove }) {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3">
      <div className="flex items-center gap-3 overflow-x-auto">
        <span className="text-xs text-gray-400 shrink-0 mr-1">Compare:</span>
        {selected.map((hotel) => (
          <div
            key={hotel.id}
            className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 shrink-0 w-48"
          >
            {hotel.image ? (
              <img src={hotel.image} alt={hotel.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <span className="text-lg">🏨</span>
              </div>
            )}
            <span className="text-xs font-medium text-gray-900 truncate flex-1">{hotel.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(hotel) }}
              className="text-gray-300 hover:text-gray-900 text-lg leading-none font-light transition-colors shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
