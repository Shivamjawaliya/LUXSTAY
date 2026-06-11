export default async function handler(req, res) {
  // Inject api_key from server env — never expose it in client requests
  const { api_key: _ignored, ...rest } = req.query
  const params = new URLSearchParams({
    ...rest,
    api_key: process.env.VITE_SERPAPI_KEY ?? '',
  })

  try {
    const response = await fetch(`https://serpapi.com/search?${params}`)
    const data = await response.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(response.status).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
