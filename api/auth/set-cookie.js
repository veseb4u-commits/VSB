import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  const cookieStr = serialize('sb-access-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  res.setHeader('Set-Cookie', cookieStr);
  res.status(200).json({ message: 'Cookie set' });
}
