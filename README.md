# pearlspaho.com

Pearl's MySpace. Vite + React static site.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## Where things are

- `src/data.js`: all copy, links, songs, friends, fortunes, gallery captions. Edit here to change content.
- `src/pages/`: one file per page (Home, Links, Invite, Film, Mail, Guestbook, Music, Fortune). `Archived.jsx` holds Letters (password "global village") and Bag; they're hidden from the nav but reachable at `/#letters` and `/#bag`.
- `src/lib/audio.js`: the profile song. It's one audio element for the whole site, so it keeps playing across pages.
- `src/pixel-cat.js`: the cat, garden, bowl and fish.
- `public/img/`: profile, friend, gallery and comment photos. `public/assets/`: song, covers, crystal ball face, bag items.

To add a gallery photo: drop it in `public/img/`, add it to `PHOTOS` and `GALLERY` in `src/data.js`.

## Deploy (Vercel)

1. vercel.com → Add New Project → import `pearlspaho-ps/myspace-website`. It detects Vite; keep the defaults.
2. Project → Settings → Domains → add `pearlspaho.com` (and `www.pearlspaho.com`). Vercel shows the DNS records to add at your domain registrar.
3. Optional: add the env vars from `.env.example` under Settings → Environment Variables, then redeploy.

## Comments + guestbook (Supabase)

Without setup, posting shows "couldn’t send yet, comments aren’t hooked up" and only the starter entries show.

1. Create a free project at supabase.com.
2. SQL Editor → paste and run `supabase/schema.sql`.
3. Settings → API → copy the Project URL and the `anon` public key into `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

New posts arrive with `status = pending`. To approve one: Table Editor → `posts` → set `status` to `approved`. Visitors only ever see approved posts, and can't edit or delete anything.

## Mail (Formspree)

Without setup, "Send it" opens a pre-filled Gmail compose window.

1. Create a form at formspree.io pointed at pearlspaho@gmail.com.
2. Put the form id (the part after `/f/`) in `VITE_FORMSPREE_ID`.

Messages then send straight from the site.
