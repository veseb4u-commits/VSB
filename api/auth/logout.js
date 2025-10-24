/**
 * Vercel Serverless Function: Logout
 * 
 * Clears authentication cookies and logs the user out.
 * 
 * POST /api/auth/logout
 */
export default async function handler(req, res) {
  // Allow both GET and POST for logout
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear the authentication cookies by setting them to expire immediately
    const cookieOptions = [
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/',
      'Max-Age=0' // Expire immediately
    ];

    res.setHeader('Set-Cookie', [
      `sb-access-token=; ${cookieOptions.join('; ')}`,
      `sb-refresh-token=; ${cookieOptions.join('; ')}`
    ]);

    return res.status(200).json({ 
      success: true,
      message: 'Logged out successfully' 
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
