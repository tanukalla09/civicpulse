# 🏙️ CivicPulse

**An AI-powered civic issue reporting platform for Indian cities — report a pothole, streetlight, or garbage problem with a photo, let Gemini classify it, and track it on a live map with gamified community engagement.**

Repo: [`tanukalla09/civicpulse`](https://github.com/tanukalla09/civicpulse) — built for the **Vibe 2 Ship Hackathon**.

---

## The Idea

Civic issues — potholes, broken streetlights, garbage pileups, water leaks, flooding — usually go unreported because reporting them is friction: who do you even call, and does it actually go anywhere? CivicPulse turns reporting into something closer to posting on social media: snap a photo, the AI figures out what it is and how bad it is, you confirm the location, and it's live on a public map for your city — with upvotes, verification by other citizens, and a points/badge system that rewards people for staying engaged.

---

## Core Features

| Feature | What it does |
|---|---|
| **AI photo analysis** | Upload a photo of the issue → Gemini 1.5 Flash classifies category, severity (1–5), urgency, and writes a one-line description automatically |
| **Interactive map** | All reported issues plotted on Google Maps with marker clustering, color-coded by category, filterable by status/category/city |
| **Community verification** | Other users can upvote an issue or verify it's real, both of which feed into reporter reputation |
| **Status tracking** | Issues move through `Open → Verified → In Progress → Resolved`, with per-issue comment threads |
| **Dashboard/analytics** | Category breakdown, resolution-speed tracking, activity calendar, trend charts over time |
| **Gamification** | Points for reporting/verifying/commenting/upvoting, badge tiers (Newcomer → Active Citizen → Community Hero → City Champion), leaderboard by city |
| **Auth** | Firebase Authentication gates reporting/voting/commenting |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling/UI | Tailwind CSS, Radix UI primitives, Framer Motion, `canvas-confetti` for celebratory moments |
| Auth + Database | Firebase Auth + Firestore (real-time listeners via `onSnapshot`) |
| AI | Google Gemini 1.5 Flash (`gemini-1.5-flash:generateContent`) — multimodal image classification |
| Maps | `@vis.gl/react-google-maps` + `@googlemaps/markerclusterer` for clustered pins |
| Charts | Recharts (trend lines, category breakdown, status donut, activity calendar) |
| Notifications | `react-hot-toast` |
| Deployment | Docker (Node 20 Alpine), builds and serves via `next start` on port 8080 |

---

## How a Report Actually Flows

The `/report` page is a 4-step wizard:

1. **Upload** — drag/drop or pick a photo (max 5MB), client-side compressed to a max-800px JPEG before anything is sent anywhere
2. **AI Analyzing** — the compressed image is POSTed to `/api/analyze`, which calls Gemini with a prompt that asks it to classify the image strictly as JSON: `category` (Pothole / Streetlight / Water Leakage / Waste-Garbage / Flooding / Other), `severity` (1–5), `description`, `confidence`, `urgency` (Low/Medium/High/Critical). If Gemini's response can't be parsed, the API falls back to a safe default (`Other`, severity 3) so the flow never breaks
3. **Review & Edit** — the form is pre-filled with whatever the AI returned, plus manual fields for title, city, and street address; severity is adjustable via a slider
4. **Success** — the issue is written directly to Firestore's `issues` collection with `status: 'Open'`, and a confetti burst plays

### A bug worth knowing about

I traced this end to end in the code, not just skimming it: `/api/analyze` returns the analysis object **flat** (`{ category, severity, description, confidence, urgency }`), but `report/page.tsx` reads it as `data.result.category`, `data.result.severity`, etc. — i.e. it expects the analysis nested under a `result` key that the API never sends. Since `data.result` is `undefined`, the `if (data.result)` check silently fails and the auto-fill never happens — no error is shown, the wizard just moves to step 3 with blank/default fields as if nothing came back. **The fix is one line**: either have `/api/analyze` return `{ result: analysis }`, or have the frontend read `data` directly instead of `data.result`.

### A related gap: no real geocoding

`form.lat` / `form.lng` are initialized to `0, 0` and never set anywhere in the report flow — despite `@vis.gl/react-google-maps` and `use-places-autocomplete` both being installed dependencies, they're only used on the `/map` page for *display*, not wired into `/report` for *input*. City and street address are free-text fields with no autocomplete or geocoding behind them, so any issue submitted through the live form will currently plot at `(0, 0)` on the map (the demo data in `lib/seed.ts` has real coordinates hardcoded, which is why the map looks populated out of the box).

---

## Data Model (Firestore)

**`issues` collection**
```ts
{
  id, title, category, description, imageBase64,
  location: { lat, lng, address, city },
  severity: 1-5, urgency: 'Low'|'Medium'|'High'|'Critical',
  status: 'Open'|'Verified'|'In Progress'|'Resolved',
  reportedBy: { uid, name, photoURL },
  upvotes: string[], verifiedBy: string[],
  aiConfidence: number,
  createdAt, updatedAt, resolvedAt?,
  comments?: Comment[]
}
```

**`users` collection**
```ts
{
  uid, name, email, photoURL,
  points, badge, city,
  issuesReported, issuesVerified, upvotesGiven,
  streak, lastActiveDate, createdAt
}
```

Images are stored as **base64 strings directly on the issue document** rather than in a separate object storage bucket — simplest possible approach for a hackathon build, though it means Firestore document sizes grow with photo count/quality.

---

## Points & Badges

| Action | Points |
|---|---|
| Report an issue | +10 |
| Verify an issue | +5 |
| Comment | +2 |
| Upvote | +1 |

| Badge | Threshold |
|---|---|
| 🌱 Newcomer | 0–50 pts |
| ⭐ Active Citizen | 51–200 pts |
| 🦸 Community Hero | 201–500 pts |
| 🏆 City Champion | 501+ pts |
| 🔥 Streak Warrior | 7-day reporting streak (separate achievement) |

Supported cities (seed data / filters): **Chennai, Bengaluru, Hyderabad**.

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/analyze` | POST | Sends a base64 image to Gemini, returns AI classification (with safe fallback on failure) |
| `/api/seed` | GET | One-time demo-data seeder — checks if the `issues` collection is empty, and if so populates it with 12 sample issues (`lib/seed.ts`) so the map/dashboard/leaderboard aren't empty on first run |

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, live ticker of recent issues, impact metrics, "how it works" |
| `/report` | The 4-step AI-assisted reporting wizard |
| `/map` | Clustered Google Map of all issues, with a filter panel (category/status/city) |
| `/issues/[id]` | Single issue detail — photo, AI analysis, status, comment thread, upvote/verify actions |
| `/dashboard` | Analytics: category breakdown, status donut, trend chart, activity calendar, resolution-speed tracker |
| `/leaderboard` | Ranked citizens by points, filterable by city, with badge display |
| `/profile` | User's own stats, badge progress, and reporting history |

---

## Getting Started

```bash
git clone https://github.com/tanukalla09/civicpulse
cd civicpulse
npm install
```

Create a `.env.local` with:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GEMINI_API_KEY=
```
> No `.env.example` currently exists in the repo — these are every environment variable actually referenced in the code (`lib/firebase.ts`, `lib/gemini.ts`, `components/map/IssueMap.tsx`).

Enable **Firestore** and **Authentication** in your Firebase project, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). On first load, hit `/api/seed` once to populate demo issues if your Firestore is empty.

## Docker

```bash
docker build -t civicpulse .
docker run -p 8080:8080 civicpulse
```

Builds with `node:20-alpine`, runs `next build` then `next start` on port `8080`.

---

## Credits

Built by **[Tanushree Kalla](https://github.com/tanukalla09)** for the **Vibe 2 Ship Hackathon**.
