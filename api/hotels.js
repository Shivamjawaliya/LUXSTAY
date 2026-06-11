export default async function handler(req, res) {
  const apiKey = process.env.VITE_SERPAPI_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: VITE_SERPAPI_KEY is not set.' })
  }

  // Inject api_key from server env — never expose it in client requests
  const { api_key: _ignored, ...rest } = req.query
  const params = new URLSearchParams({ ...rest, api_key: apiKey })

  try {
    const response = await fetch(`https://serpapi.com/search?${params}`)
    const data = await response.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(response.status).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
