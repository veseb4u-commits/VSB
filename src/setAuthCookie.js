// Call this after successful login to set Supabase access token in a secure cookie
export function setAuthCookie(session) {
  if (!session?.access_token) return;

  // Set cookie manually (better to do server-side in production)
  document.cookie = `sb-access-token=${session.access_token}; Path=/; Secure; SameSite=Strict`;
}
