import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

/**
 * Vercel Serverless Function: Secure Game Delivery
 * 
 * Delivers game HTML files securely after authentication and session limit checks.
 * 
 * GET /api/games/[slug]
 * Example: /api/games/brain-games
 */
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the game slug from the URL
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({ error: 'Game slug is required' });
    }

    // Get authentication tokens from cookies
    const accessToken = req.cookies['sb-access-token'];
    const refreshToken = req.cookies['sb-refresh-token'];

    if (!accessToken) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access games' 
      });
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify the access token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return res.status(401).json({ 
        error: 'Invalid or expired session',
        message: 'Please log in again' 
      });
    }

    // Get user's profile and check role/session limits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, session_start, session_count, session_history')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    // Check session limits for free users
    if (profile.role === 'free') {
      const now = new Date();
      const sessionStart = profile.session_start ? new Date(profile.session_start) : null;
      
      // Check if it's a new day
      const isNewDay = !sessionStart || 
        sessionStart.toDateString() !== now.toDateString();
      
      if (isNewDay) {
        // Reset daily session count
        await supabase
          .from('profiles')
          .update({
            session_count: 1,
            session_start: now.toISOString()
          })
          .eq('id', user.id);
      } else {
        // Check if user has exceeded daily session limit (2 sessions per day)
        if (profile.session_count >= 2) {
          return res.status(403).json({
            error: 'Session limit exceeded',
            message: 'Free users are limited to 2 sessions per day. Upgrade to premium for unlimited access.',
            limit: 2,
            used: profile.session_count
          });
        }
      }
    }

    // Load the game HTML file
    const gamePath = path.join(process.cwd(), 'private-games', `${slug}.html`);
    
    // Check if game file exists
    if (!fs.existsSync(gamePath)) {
      return res.status(404).json({ 
        error: 'Game not found',
        message: `The game "${slug}" does not exist` 
      });
    }

    // Read the game HTML
    const gameHTML = fs.readFileSync(gamePath, 'utf-8');

    // Set security headers (these will be combined with vercel.json headers)
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('X-User-Role', profile.role);

    // Return the game HTML
    return res.status(200).send(gameHTML);

  } catch (error) {
    console.error('Game delivery error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
