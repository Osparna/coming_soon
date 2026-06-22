import postgres from 'postgres';

// prepare:false is required for the Supabase transaction pooler (port 6543)
const sql = postgres(process.env.DATABASE_URL, { prepare: false });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  let { site, email, phone, message } = req.body || {};
  site    = (site || '').trim();
  email   = (email || '').trim().toLowerCase();
  phone   = (phone || '').trim() || null;
  message = (message || '').trim() || null;

  if (!site) return res.status(400).json({ error: 'missing site' });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid email' });
  }

  try {
    await sql`insert into contacts (site, email, phone, message)
              values (${site}, ${email}, ${phone}, ${message})`;
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'insert failed' });
  }
}
