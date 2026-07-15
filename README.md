# Movie Roulette

Stop scrolling. Start watching. One movie at a time — swipe, save, or watch tonight.

Built with Next.js (App Router), TypeScript, Tailwind CSS 4, and Framer Motion.
Movie data comes live from the TMDB API through server-side routes, so your API
key is never exposed in the browser. Watchlist, watched movies, ratings, and
filters live in your browser's localStorage — no account, no database.

---

## 1. Get a TMDB API key (free, 2 minutes)

1. Create an account at https://www.themoviedb.org
2. Go to **Settings → API** and request a key (choose "Developer", any URL works)
3. Copy either the **API Key (v3)** or the **Read Access Token (v4)**

## 2. Run locally

```bash
npm install
cp .env.example .env.local     # then paste your key into .env.local
npm run dev                    # http://localhost:3000
```

## 3. Deploy to Vercel (public HTTPS URL)

**Option A — via GitHub (recommended, enables one-push redeploys):**

1. Push this folder to a GitHub repository:
   ```bash
   git init && git add -A && git commit -m "Movie Roulette"
   git remote add origin https://github.com/YOUR_USERNAME/movie-roulette.git
   git push -u origin main
   ```
2. Go to https://vercel.com → **Add New → Project** → import the repo
3. Before deploying, open **Environment Variables** and add:
   - `TMDB_API_KEY` = your v3 key (or `TMDB_ACCESS_TOKEN` = your v4 token)
   - `TMDB_REGION` = `FR` (or your country code)
4. Click **Deploy**. Vercel gives you a public HTTPS URL like
   `https://movie-roulette-xxxx.vercel.app` — that's your live site.

**Option B — via the Vercel CLI (no GitHub needed):**

```bash
npm i -g vercel
vercel                         # follow the prompts
vercel env add TMDB_API_KEY    # paste your key, select all environments
vercel --prod                  # final production deploy → public URL
```

HTTPS is automatic on Vercel — nothing to configure.

## 4. Updating the site later

- **With GitHub:** edit the code, then `git add -A && git commit -m "update" && git push`.
  Vercel rebuilds and redeploys automatically in ~1 minute.
- **With the CLI:** edit the code, then run `vercel --prod`.
- **Changing the API key or region:** Vercel dashboard → your project →
  **Settings → Environment Variables**, edit, then **Deployments → Redeploy**.

## Project structure

```
app/
  page.tsx              Homepage
  roulette/page.tsx     Filters + swipe deck + Surprise Me
  movie/[id]/page.tsx   Cinematic result page (trailer, cast, providers, similar)
  watchlist/page.tsx    Saved movies
  watched/page.tsx      Watched movies with 1–5 star ratings
  api/
    discover/route.ts   Server-side TMDB discover (filters → movies)
    movie/[id]/route.ts Server-side TMDB details
    genres/route.ts     Server-side TMDB genre list
components/             Nav, SwipeDeck, FilterPanel, shared UI
lib/
  tmdb.ts               Server-only TMDB client (reads the env key)
  storage.ts            localStorage hooks (watchlist, watched, filters)
  constants.ts          Moods, options, image URL helpers
  types.ts              Shared TypeScript types
```

## Notes

- The site works without a key locally, but the roulette will show a clear
  "no TMDB key configured" message until you add one.
- Keyboard controls on the roulette: ← skip, → save, Enter = Watch Tonight.
- Attribution: this product uses the TMDB API but is not endorsed or
  certified by TMDB.
