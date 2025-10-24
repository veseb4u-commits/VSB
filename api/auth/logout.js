import { serialize } from 'cookie';

export default function handler(req, res) {
  const cookieStr = serialize('sb-access-token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: 0, // Expire immediately
  });

  res.setHeader('Set-Cookie', cookieStr);
  res.status(200).json({ message: 'Logged out' });
}
