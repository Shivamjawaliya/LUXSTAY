# LuxStay — Hotel Search & Comparison

A hospitality-focused React 18 frontend with Supabase authentication, Google Hotels search via SerpApi, interactive hotel comparison, and Recharts visualizations.

## Tech Stack

- **React 18** + Vite + Hooks
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Supabase** — email/password + OAuth (Google, GitHub, Azure)
- **SerpApi Google Hotels API** — search, pagination, hotel details
- **Recharts** — price bar chart, rating comparison chart
- **Context API** — global auth state
- **localStorage** — persist compare selections and search dates

## Features

| Feature | Details |
|---|---|
| Auth | Login / Signup with email or OAuth; JWT stored in localStorage |
| Protected routes | `/search`, `/compare`, `/profile`, `/hotel/*` require login |
| Hotel search | Filter by destination, check-in/out dates, guests |
| Autocomplete | Instant city suggestions (80+ destinations) |
| Pagination | Load More via SerpApi `next_page_token` |
| Hotel cards | Image, name, description, rating, price, deal badge |
| Compare | Select up to 3 hotels; price bar chart + rating chart + side-by-side table |
| Hotel detail | Full gallery, amenities, nearby places, reviews breakdown |
| Profile | Email, member since, last sign in, sign out |

## Setup

### 1. Clone & install

```bash
git clone https://github.com/Shivamjawaliya/LUXSTAY.git
cd LUXSTAY
npm install
```

### 2. Create `.env`

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_SERPAPI_KEY=<your-serpapi-key>
```

> **Supabase**: [supabase.com](https://supabase.com) → New project → Settings → API  
> **SerpApi**: [serpapi.com](https://serpapi.com) → Dashboard → API Key  
> Never commit `.env` — it is gitignored.

### 3. Run dev server

```bash
npm run dev
```

The Vite dev server proxies `/api/hotels` → `https://serpapi.com/search` to bypass CORS.

### 4. Build for production

```bash
npm run build
```

> For production deployment (Vercel / Netlify), add the same environment variables in the dashboard and set up a serverless proxy for SerpApi — the Vite proxy only works during local development.

## Project Structure

```
src/
  context/        AuthContext.jsx      — Supabase session + JWT
  pages/          Landing, Login, Signup, Search, Compare, HotelDetail, Profile
  services/       hotelsClient.js      — SerpApi calls
                  supabaseClient.js    — Supabase client init
```

## Assumptions & Notes

- SerpApi is used in place of Amadeus/Sabre/Hotelbeds as it provides richer, free-tier hotel data (images, ratings, amenities) without IP-based restrictions.
- The Vite proxy handles CORS for local dev. A backend proxy is required for deployed environments.
- Hotel search quota: 250 free searches/month on SerpApi free tier.
