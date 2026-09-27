// Friend comments + guestbook signatures, stored in Supabase.
// New posts are saved as 'pending' and only show up once Pearl approves them
// (flip `status` to 'approved' in the Supabase table editor).
// Setup: see supabase/schema.sql and README.md.

const URL_ = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const postsEnabled = Boolean(URL_ && KEY);

const headers = () => ({ apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' });

const fmt = (d) => {
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch (e) { return ''; }
};

// Approved entries for `kind` ('comments' | 'guestbook'), newest first.
export async function loadPosts(kind) {
  if (!postsEnabled) return [];
  try {
    const q = `${URL_}/rest/v1/posts?select=name,body,mood,created_at&kind=eq.${kind}&status=eq.approved&order=created_at.desc&limit=200`;
    const res = await fetch(q, { headers: headers() });
    if (!res.ok) return [];
    const rows = await res.json();
    return rows.map(r => ({ name: r.name, body: r.body, mood: r.mood || 'happy', date: fmt(r.created_at) }));
  } catch (e) {
    return [];
  }
}

// Saves a post for approval. Resolves true on success.
export async function submitPost(kind, entry) {
  if (!postsEnabled) return false;
  const row = {
    kind,
    name: String(entry.name || '').slice(0, 40),
    body: String(entry.body || '').slice(0, 600),
    mood: entry.mood ? String(entry.mood).slice(0, 20) : null
  };
  try {
    const res = await fetch(`${URL_}/rest/v1/posts`, {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=minimal' },
      body: JSON.stringify(row)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export function postResultMessage(ok) {
  return ok ? 'sent! it’ll show up once pearl approves it ♡' : 'couldn’t send yet, comments aren’t hooked up';
}
