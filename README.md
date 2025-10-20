# V/eseb - Gaming & Dev Tools Platform

A modern gaming and development tools platform built with React, Vite, and Supabase.

## 🚀 Features

- ✅ User Authentication (Sign Up/Login)
- ✅ Game Repository with Ratings
- ✅ Playable Games in Browser
- ✅ Download Tracking
- ✅ Modern UI with Tailwind CSS
- ✅ Connected to Supabase Database

## 📋 Setup Instructions

### 1. Configure Supabase

Edit `src/App.jsx` and replace:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

With your actual Supabase credentials from: **Supabase Dashboard → Settings → API**

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Deploy!

## 📁 Project Structure

```
veseb-platform/
├── public/
│   └── games/           # Add your game HTML files here
├── src/
│   ├── App.jsx          # Main React component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## 🎮 Adding Games

1. Place game HTML files in `public/games/`
2. Add entry in Supabase `apps` table
3. Set `game_url` to `/games/your-game.html`
4. Set `is_playable` to `true`

## 🔧 Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase
- **Deployment**: Vercel

## 📝 License

MIT

## 🤝 Support

For issues or questions, check the Supabase and Vercel documentation.
