import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import cookie from 'cookie';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuration
const MAX_SESSIONS_PER_DAY = 2;
const SESSION_DURATION_MINUTES = 15;

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies['sb-access-token'];

  if (!token) {
    return res.status(401).send('Not authenticated');
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).send('Invalid or expired token');
  }

  const { slug } = req.query;
  const allowedGames = ['brain-games', 'hiit-trainer1'];
  if (!allowedGames.includes(slug)) {
    return res.status(404).send('Game not found');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, session_start, session_count, session_history')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return res.status(403).send('Profile not found');
  }

  if (profile.role === 'premium') {
    return serveGame(slug, res);
  }

  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const sessionStart = profile.session_start ? new Date(profile.session_start) : null;
  const sessionStartDate = sessionStart ? sessionStart.toISOString().split('T')[0] : null;
  const sessionCount = profile.session_count || 0;
  const sessionHistory = Array.isArray(profile.session_history) ? profile.session_history : [];

  const sessionExpired =
    !sessionStart ||
    sessionStartDate !== today ||
    (now - sessionStart) / (1000 * 60) > SESSION_DURATION_MINUTES;

  if (sessionExpired) {
    if (sessionStartDate === today && sessionCount >= MAX_SESSIONS_PER_DAY) {
      return res.status(403).json({ error: 'LIMIT_REACHED', message: 'Free session limit reached. Please upgrade.' });
    }

    const newSessionCount = sessionStartDate === today ? sessionCount + 1 : 1;

    // Update session history (max 5 days)
    const updatedHistory = sessionHistory.filter(entry => entry.date !== today);
    updatedHistory.push({ date: today, sessions: newSessionCount });
    if (updatedHistory.length > 5) {
      updatedHistory.shift(); // remove oldest
    }

    await supabase
      .from('profiles')
      .update({
        session_start: now.toISOString(),
        session_count: newSessionCount,
        session_history: updatedHistory
      })
      .eq('id', user.id);

    return serveGame(slug, res);
  }

  return serveGame(slug, res);
}

function serveGame(slug, res) {
  const gamePath = path.join(process.cwd(), 'private-games', `${slug}.html`);
  try {
    const html = fs.readFileSync(gamePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-ancestors 'self';"
    );
    res.status(200).send(html);
  } catch (err) {
    res.status(500).send('Server error');
  }
}
