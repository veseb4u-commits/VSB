import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Gamepad2, Code, Zap, Shield, Download, Star, Database, Lightbulb } from 'lucide-react';

// IMPORTANT: Replace these with your actual Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Simple Supabase client (lightweight - no npm package needed for demo)
const supabase = {
  auth: {
    async signUp(email, password) {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ email, password })
      });
      return await response.json();
    },
    async signIn(email, password) {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ email, password })
      });
      return await response.json();
    },
    async signOut(token) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': SUPABASE_ANON_KEY
        }
      });
    },
    getUser(token) {
      return fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': SUPABASE_ANON_KEY
        }
      }).then(r => r.json());
    }
  },
  from(table) {
    return {
      select(columns = '*') {
        return {
          async eq(column, value) {
            const response = await fetch(
              `${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}&select=${columns}`,
              {
                headers: {
                  'apikey': SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
              }
            );
            return { data: await response.json() };
          },
          async exec() {
            const response = await fetch(
              `${SUPABASE_URL}/rest/v1/${table}?select=${columns}`,
              {
                headers: {
                  'apikey': SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
              }
            );
            return { data: await response.json() };
          }
        };
      }
    };
  }
};

export default function VesebLanding() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [playingGame, setPlayingGame] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Emoji mapping for display
  const emojiMap = {
    'brain': '🧠',
    'laptop': '💻',
    'swords': '⚔️',
    'wrench': '🔧',
    'castle': '🏰',
    'package': '📦'
  };

  // Load apps from Supabase
  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const { data } = await supabase.from('apps').select('*').exec();
      if (data) {
        setApps(data);
      }
    } catch (err) {
      console.error('Error loading apps:', err);
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const result = await supabase.auth.signUp(formData.email, formData.password);
        if (result.access_token) {
          setAuthToken(result.access_token);
          setCurrentUser(result.user);
          setIsLoggedIn(true);
          setShowLogin(false);
        } else if (result.error) {
          setError(result.error.message);
        }
      } else {
        const result = await supabase.auth.signIn(formData.email, formData.password);
        if (result.access_token) {
          setAuthToken(result.access_token);
          setCurrentUser(result.user);
          setIsLoggedIn(true);
          setShowLogin(false);
        } else if (result.error) {
          setError(result.error.message);
        }
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setFormData({ email: '', password: '', username: '' });
    }
  };

  const handleLogout = async () => {
    if (authToken) {
      await supabase.auth.signOut(authToken);
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthToken(null);
    setPlayingGame(null);
  };

  const getGameContent = (gameUrl) => {
    const games = {
      'demo-game-2': `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; font-family: Arial;">
          <h1 style="font-size: 3rem; margin-bottom: 2rem;">⚔️ Battle Royale Arena</h1>
          <div style="background: rgba(0,0,0,0.3); padding: 2rem; border-radius: 1rem; max-width: 600px;">
            <p style="font-size: 1.2rem; margin-bottom: 1rem;">Enter the arena! This is a demo game.</p>
            <p style="margin-bottom: 2rem;">Replace this with your actual Battle Royale game content.</p>
            <button onclick="alert('Entering arena...')" style="background: #fff; color: #f5576c; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 0.5rem; cursor: pointer; font-weight: bold;">Enter Arena</button>
          </div>
        </div>
      `,
      'demo-game-3': `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; font-family: Arial;">
          <h1 style="font-size: 3rem; margin-bottom: 2rem;">🏰 Dungeon Master</h1>
          <div style="background: rgba(0,0,0,0.3); padding: 2rem; border-radius: 1rem; max-width: 600px;">
            <p style="font-size: 1.2rem; margin-bottom: 1rem;">Explore the dungeons! This is a demo game.</p>
            <p style="margin-bottom: 2rem;">Your dungeon exploration game would load here.</p>
            <button onclick="alert('Starting quest...')" style="background: #fff; color: #4facfe; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 0.5rem; cursor: pointer; font-weight: bold;">Start Quest</button>
          </div>
        </div>
      `
    };
    return games[gameUrl] || '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial; color: #666;">Game not found</div>';
  };

  if (playingGame) {
    if (playingGame.is_hosted) {
      return (
        <div className="fixed inset-0 bg-black z-50">
          <div className="absolute top-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600/50 rounded-lg flex items-center justify-center border border-purple-400/30">
                <Code className="text-purple-200" size={20} />
              </div>
              <span className="text-xl font-bold text-white">{playingGame.name}</span>
            </div>
            <button
              onClick={() => setPlayingGame(null)}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-white font-semibold"
            >
              Exit Game
            </button>
          </div>
          <div className="w-full h-full">
            <iframe
              src={playingGame.game_url}
              className="w-full h-full border-0"
              title={playingGame.name}
              allow="fullscreen"
            />
          </div>
        </div>
      );
    }
    
    return (
      <div className="fixed inset-0 bg-black z-50">
        <div className="absolute top-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/50 rounded-lg flex items-center justify-center border border-purple-400/30">
              <Code className="text-purple-200" size={20} />
            </div>
            <span className="text-xl font-bold text-white">{playingGame.name}</span>
          </div>
          <button
            onClick={() => setPlayingGame(null)}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-white font-semibold"
          >
            Exit Game
          </button>
        </div>
        <div className="w-full h-full">
          <iframe
            srcDoc={getGameContent(playingGame.game_url)}
            className="w-full h-full border-0"
            title={playingGame.name}
          />
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <nav className="bg-black/30 backdrop-blur-md border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600/50 rounded-lg flex items-center justify-center border border-purple-400/30">
                <Code className="text-purple-200" size={20} />
              </div>
              <span className="text-2xl font-bold text-white tracking-wide">V/eseb</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-purple-300">Welcome, {currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">App Repository</h1>
            <p className="text-purple-300">Access your collection of games and development tools</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map(app => (
              <div
                key={app.id}
                className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/60 transition transform hover:scale-105"
              >
                <div className="text-6xl mb-4">{emojiMap[app.emoji] || '🎮'}</div>
                <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
                <p className="text-purple-300 text-sm mb-3">{app.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Download size={16} />
                    <span>{app.downloads > 1000 ? `${Math.floor(app.downloads/1000)}K+` : app.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span>{app.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {app.is_playable && (
                    <button
                      onClick={() => setPlayingGame(app)}
                      className="flex-1 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-semibold transition"
                    >
                      Play Now
                    </button>
                  )}
                  <button className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-10 left-10 w-20 h-20 bg-purple-700/10 rounded-lg border border-purple-400/20 flex items-center justify-center opacity-50">
        <Code size={40} className="text-purple-300" />
      </div>
      
      <div className="absolute top-20 right-20 opacity-10">
        <Database size={120} className="text-purple-300" />
      </div>

      <div className="absolute bottom-32 left-20 opacity-10">
        <Lightbulb size={100} className="text-purple-300" />
      </div>

      <div className="absolute top-4 left-1/4 text-purple-400/20 text-2xl font-mono">101010</div>
      
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-purple-700/10 rounded-full border border-purple-400/20 opacity-40"></div>
      
      <div className="absolute bottom-1/4 right-1/3 text-purple-400/15 text-6xl font-mono">&lt;/&gt;</div>
      
      <div className="absolute top-1/2 left-1/4 opacity-10">
        <Gamepad2 size={90} className="text-purple-300" />
      </div>
      
      <div className="absolute bottom-20 right-20 text-purple-400/20 text-xl font-mono">110101</div>
      
      <div className="absolute top-40 left-1/3 w-24 h-24 border-2 border-purple-400/10 rounded-lg rotate-12"></div>
      
      <div className="absolute bottom-40 left-1/2 opacity-10">
        <Shield size={80} className="text-purple-300" />
      </div>
      
      <div className="absolute top-1/4 right-1/4 text-purple-400/15 text-4xl font-mono">{'{ }'}</div>
      
      <div className="absolute bottom-1/3 left-16 w-20 h-20 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-full"></div>
      
      <div className="absolute top-2/3 right-1/4 opacity-10">
        <Zap size={70} className="text-purple-300" />
      </div>
      
      <div className="absolute top-1/2 right-10 text-purple-400/20 text-lg font-mono">011010</div>
      
      <div className="absolute bottom-1/2 left-1/3 w-12 h-12 border border-purple-400/20 rounded-lg -rotate-12 opacity-30"></div>
      
      <div className="absolute top-1/4 left-10 text-purple-400/15 text-3xl font-mono">fn()</div>
      
      <div className="absolute bottom-1/4 left-1/4 w-32 h-32 border border-purple-400/10 rounded-full"></div>
      
      <div className="absolute top-3/4 right-1/3 text-purple-400/20 text-2xl font-mono">[...]</div>
      
      <div className="absolute top-1/3 left-1/2 w-16 h-16 bg-gradient-to-tr from-purple-600/10 to-pink-600/10 rounded-lg rotate-45"></div>
      
      <div className="absolute bottom-1/2 right-1/2 opacity-10">
        <Download size={60} className="text-purple-300" />
      </div>
      
      <div className="absolute top-1/2 left-10 text-purple-400/15 text-xl font-mono">=&gt;</div>
      
      <div className="absolute bottom-1/3 right-10 w-14 h-14 border-2 border-purple-400/15 rounded-full opacity-40"></div>
      
      <div className="absolute top-2/3 left-1/4 text-purple-400/20 text-lg font-mono">101101</div>
      
      <div className="absolute bottom-20 left-1/3 w-10 h-10 bg-purple-700/10 rounded-lg border border-purple-400/20 opacity-50"></div>
      
      <div className="absolute top-1/2 right-1/3 text-purple-400/15 text-5xl font-mono">#</div>
      
      <div className="absolute bottom-1/4 right-20 text-purple-400/20 text-xl font-mono">010110</div>
      
      <div className="absolute top-3/4 left-20 opacity-10">
        <Star size={50} className="text-purple-300 fill-purple-300" />
      </div>
      
      <div className="absolute top-1/3 right-1/2 w-20 h-20 border border-purple-400/10 rounded-lg rotate-6 opacity-25"></div>
      
      <div className="absolute bottom-1/3 left-1/2 text-purple-400/15 text-2xl font-mono">var x</div>

      <nav className="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/50 rounded-lg flex items-center justify-center border border-purple-400/30">
              <Code className="text-purple-200" size={20} />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">V/eseb</span>
          </div>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Power Up Your Gaming & Development
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
            Access premium games and cutting-edge development tools all in one place. Join thousands of developers and gamers building the future.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setShowLogin(true); setIsSignUp(true); }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-bold text-lg transition border border-purple-400/30">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose V/eseb?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Gamepad2, title: 'Premium Games', desc: 'Access exclusive gaming titles' },
            { icon: Code, title: 'Dev Tools', desc: 'Professional development suite' },
            { icon: Zap, title: 'Fast Performance', desc: 'Optimized for speed' },
            { icon: Shield, title: 'Secure Platform', desc: 'Enterprise-grade security' },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/60 transition transform hover:scale-105"
            >
              <feature.icon className="text-purple-400 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-purple-200">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {showLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => { setShowLogin(false); setIsSignUp(false); setError(''); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>
            
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-purple-600/50 rounded-xl flex items-center justify-center border border-purple-400/30">
                <Code className="text-purple-200" size={32} />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-center mb-6">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none text-white"
                  placeholder="Enter email"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none text-white"
                    placeholder="Enter password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button
                onClick={handleAuth}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </div>
            <p className="text-center mt-4 text-purple-300">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
