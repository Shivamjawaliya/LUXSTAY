const BASE_URL = '/api/hotels'
const API_KEY = import.meta.env.VITE_SERPAPI_KEY

async function parseResponse(res, label) {
  const text = await res.text()
  if (!text) return null
  if (!res.ok) throw new Error(`${label} failed (${res.status}): ${text.slice(0, 200)}`)
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`${label}: invalid JSON`)
  }
}

function mapProperty(p) {
  return {
    id: p.property_token,
    propertyToken: p.property_token,
    name: p.name,
    description: p.description ?? '',
    price: p.rate_per_night?.lowest ?? 'N/A',
    exactPrice: p.rate_per_night?.extracted_lowest ?? null,
    starRating: p.extracted_hotel_class ?? null,
    guestRating: p.overall_rating ?? null,
    reviewCount: p.reviews ?? null,
    address: '',
    image: p.images?.[0]?.original_image ?? p.images?.[0]?.thumbnail ?? null,
    images: p.images ?? [],
    amenities: p.amenities ?? [],
    nearbyPlaces: p.nearby_places ?? [],
    deal: p.deal ?? null,
    freeCancellation: p.free_cancellation ?? false,
    checkInTime: p.check_in_time ?? null,
    checkOutTime: p.check_out_time ?? null,
    ratingsBreakdown: p.reviews_breakdown ?? [],
    link: p.link ?? null,
  }
}


export async function searchHotels({ city, checkIn, checkOut, adults, nextPageToken }) {
  const params = new URLSearchParams({
    engine: 'google_hotels',
    q: city,
    check_in_date: checkIn,
    check_out_date: checkOut,
    adults: String(adults),
    children: '0',
    currency: 'USD',
    gl: 'us',
    hl: 'en',
    api_key: API_KEY,
  })
  if (nextPageToken) params.set('next_page_token', nextPageToken)

  const res = await fetch(`${BASE_URL}?${params}`)
  const data = await parseResponse(res, 'searchHotels')
  if (!data) return { hotels: [], totalCount: 0, nextPageToken: null }

  const properties = data.properties ?? []
  const hotels = properties.map(mapProperty)

  return {
    hotels,
    totalCount: data.search_information?.total_results ?? hotels.length,
    nextPageToken: data.serpapi_pagination?.next_page_token ?? null,
  }
}

export async function getHotelDetails(propertyToken, checkIn, checkOut, adults = 1) {
  const params = new URLSearchParams({
    engine: 'google_hotels',
    property_token: propertyToken,
    check_in_date: checkIn,
    check_out_date: checkOut,
    adults: String(adults),
    children: '0',
    currency: 'USD',
    gl: 'us',
    hl: 'en',
    api_key: API_KEY,
  })

  const res = await fetch(`${BASE_URL}?${params}`)
  return parseResponse(res, 'getHotelDetails')
}

// Search results already carry full data — no extra API call needed
export async function enrichHotel(hotel) {
  return hotel
}
