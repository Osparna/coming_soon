import postgres from 'postgres';

// prepare:false is required for the Supabase transaction pooler (port 6543)
const sql = postgres(process.env.WAITLIST_DB_URL, { prepare: false });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  let { email } = req.body || {};
  email = (email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid email' });
  }

  try {
    await sql`insert into waitlist_signups (email) values (${email}) on conflict do nothing`;
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'insert failed' });
  }
}
