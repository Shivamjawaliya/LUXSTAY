export default function StarRating({ count }) {
  if (!count) return null
  const full = Math.floor(Math.min(count, 5))
  return (
    <span className="text-amber-400 text-xs tracking-tight">
      {'★'.repeat(full)}<span className="text-gray-200">{'★'.repeat(Math.max(0, 5 - full))}</span>
    </span>
  )
}
