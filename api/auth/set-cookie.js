mport { createClient } from '@supabase/supabase-js';

/**
 * Vercel Serverless Function: Set Authentication Cookie
 * 
 * This endpoint receives auth tokens from the frontend after Supabase login
 * and sets them as secure HTTP-only cookies.
 * 
 * POST /api/auth/set-cookie
 * Body: { access_token, refresh_token }
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { access_token, refresh_token } = req.body;

    // Validate tokens are present
    if (!access_token || !refresh_token) {
      return res.status(400).json({ error: 'Missing authentication tokens' });
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify the access token is valid
    const { data: { user }, error: authError } = await supabase.auth.getUser(access_token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid authentication tokens' });
    }

    // Update user's session tracking in profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        session_start: new Date().toISOString(),
        session_count: supabase.raw('session_count + 1')
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update session:', updateError);
      // Continue anyway - session tracking failure shouldn't block auth
    }

    // Set secure HTTP-only cookies
    const cookieOptions = [
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/',
      'Max-Age=604800' // 7 days
    ];

    res.setHeader('Set-Cookie', [
      `sb-access-token=${access_token}; ${cookieOptions.join('; ')}`,
      `sb-refresh-token=${refresh_token}; ${cookieOptions.join('; ')}`
    ]);

    return res.status(200).json({ 
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Set-cookie error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
