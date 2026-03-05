# PixelDrop 🪙

AI-powered marketplace where users generate content with OpenAI, list it for PixelCoins, and sell to friends. Top monthly sellers win real Amazon gift cards.

## Quick Start

```bash
npm install
npm start
```

## Project Structure

```
src/
  App.jsx        # Entire frontend (all pages + components)
  index.js       # React entry point
public/
  index.html     # HTML shell
```

## Pages

| Page | State value | Auth required |
|------|------------|---------------|
| Landing | `landing` | No |
| Marketplace | `marketplace` | No |
| Listing Detail | `listing_<id>` | No |
| Create & List | `create` | Yes |
| Blog | `blog` | No |
| Leaderboard | `leaderboard` | No |
| Login / Signup | `auth` | No |
| Admin Dashboard | `admin` | No (add guard!) |

## Backend TODO

### Auth
- [ ] POST `/api/auth/signup`
- [ ] POST `/api/auth/login`
- [ ] GET `/api/auth/me`

### Listings
- [ ] GET `/api/listings`
- [ ] GET `/api/listings/:id`
- [ ] POST `/api/listings` (auth)
- [ ] DELETE `/api/listings/:id` (admin)

### AI Generation
- [ ] POST `/api/generate` — call OpenAI, decrement daily quota
- [ ] GET `/api/generate/quota` — generations left today

### Transactions
- [ ] POST `/api/buy/:listingId` — transfer coins
- [ ] GET `/api/transactions` — purchase history

### Admin
- [ ] GET `/api/admin/stats`
- [ ] PUT `/api/admin/limits`
- [ ] PUT `/api/admin/ads`
- [ ] POST `/api/admin/blog`
- [ ] PUT `/api/admin/users/:id/suspend`

### Leaderboard
- Monthly reset cron job
- Email top 3 Amazon gift cards at end of month

## OpenAI Integration

Replace the mock `generate()` in `CreatePage` with:

```js
const res = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ type: genType, prompt })
});
const data = await res.json();
// data.url for images, data.content for docs/pdfs
```

## Suggested Stack

- **Backend:** Node.js + Express or Next.js API routes
- **Database:** PostgreSQL + Redis (daily quotas)
- **Auth:** JWT
- **AI:** OpenAI API (DALL-E 3 for images, GPT-4o for docs)
- **Email:** Resend or SendGrid
- **Hosting:** Vercel + Railway or Supabase

## Test Credentials (mock)

- `closer@pixel.com` / `pass123`
- `nova@pixel.com` / `pass123`

## Admin Access

Set page state to `"admin"` or add a route guard + admin role in your backend before going live.
