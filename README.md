# 🚀 V/eseb Platform - GitHub.dev Setup Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `veseb-platform`
3. Description: "Gaming and dev tools platform"
4. **Public** or Private (your choice)
5. ✅ Check "Add a README file"
6. Click **"Create repository"**

---

## Step 2: Open GitHub.dev

1. Go to your new repository
2. Press the **`.` (period)** key on your keyboard
3. VS Code opens in your browser! 🎉
4. You'll see a file explorer on the left
modddd
---

## Step 3: Create All Files

### Create these files one by one. Copy the content for each:

---

### 📄 **File 1: `package.json`** (Root folder)

**Click:** Explorer → New File → Type: `package.json`

**Paste this:**

```json
{
  "name": "veseb-platform",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "vite": "^4.4.5"
  }
}
```

---

### 📄 **File 2: `vite.config.js`** (Root folder)

**Create:** `vite.config.js`

**Paste:**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

---

### 📄 **File 3: `tailwind.config.js`** (Root folder)

**Create:** `tailwind.config.js`

**Paste:**

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

### 📄 **File 4: `postcss.config.js`** (Root folder)

**Create:** `postcss.config.js`

**Paste:**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

### 📄 **File 5: `.gitignore`** (Root folder)

**Create:** `.gitignore`

**Paste:**

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.production
```

---

### 📄 **File 6: `index.html`** (Root folder)

**Create:** `index.html`

**Paste:**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>V/eseb - Gaming & Dev Tools Platform</title>
    <meta name="description" content="Access premium games and cutting-edge development tools all in one place." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## Step 4: Create `src` Folder

1. Right-click in Explorer
2. Click **"New Folder"**
3. Name it: `src`

---

### 📄 **File 7: `src/main.jsx`**

**Create:** `src/main.jsx` (inside src folder)

**Paste:**

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

### 📄 **File 8: `src/index.css`**

**Create:** `src/index.css`

**Paste:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}
```

---

### 📄 **File 9: `src/App.jsx`** ⚠️ IMPORTANT - UPDATE SUPABASE CREDENTIALS

**Create:** `src/App.jsx`

**Paste the React code from the first artifact, BUT FIRST:**

Replace lines 6-7 with YOUR actual Supabase credentials:

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co'; // ← YOUR URL HERE
const SUPABASE_ANON_KEY = 'eyJhbGc...'; // ← YOUR KEY HERE
```

Then paste the entire App.jsx code.

---

## Step 5: Commit & Push

1. Click the **Source Control icon** (looks like a branch) on the left sidebar
2. You'll see all your new files
3. Type a commit message: `Initial V/eseb platform setup`
4. Click **✓ Commit & Push**
5. If prompted, click **"Yes"** to stage all changes

---

## Step 6: Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New" → "Project"**
3. Import your `veseb-platform` repository
4. Vercel auto-detects Vite
5. Click **"Deploy"**
6. Wait 2-3 minutes ⏰
7. Your site is LIVE! 🎉

---

## Step 7: Add Brain Training Games (Optional)

### Create `public` folder:

1. In GitHub.dev, create folder: `public`
2. Inside public, create folder: `games`
3. Create file: `public/games/brain-games.html`
4. Paste the Brain Training Games HTML (from the standalone artifact)
5. Commit & Push

### Update Supabase:

1. Go to Supabase → Table Editor → apps
2. Find "Brain Training Games" row
3. Edit `game_url` to: `/games/brain-games.html`
4. Save

---

## ✅ Verification Checklist

After deployment, test:

- [ ] Visit your Vercel URL
- [ ] Click "Sign Up" and create account
- [ ] Check Supabase → Authentication (user appears)
- [ ] Sign in
- [ ] See apps loaded from database
- [ ] Click "Play Now" on a game
- [ ] Game loads in fullscreen

---

## 🎉 You're Done!

Your V/eseb platform is now:
✅ On GitHub
✅ Deployed on Vercel
✅ Connected to Supabase
✅ Live and accessible!

---

## 🔧 Making Updates

To update your site:

1. Press `.` on your GitHub repo (opens GitHub.dev)
2. Make changes
3. Commit & Push
4. Vercel auto-deploys! 🚀

---

## ❓ Troubleshooting

**Issue: Files not saving**
- Make sure you're signed into GitHub in the browser

**Issue: Vercel build fails**
- Check all files are committed
- Verify package.json is in root folder
- Check Vercel build logs

**Issue: Apps not loading**
- Verify Supabase credentials are correct
- Check browser console for errors (F12)

**Issue: Can't sign in**
- Check Supabase → Settings → Authentication → Email Auth is enabled
- Disable "Confirm email" for testing

---

## 📞 Need Help?

If you get stuck:
1. Check the browser console (F12) for errors
2. Check Vercel deployment logs
3. Verify Supabase connection in the Network tab

---

## 🚀 Next Steps

Once everything works:

1. **Customize branding** - Update colors, logo, text
2. **Add more games** - Upload to `public/games/`
3. **Create admin panel** - Manage apps visually
4. **Add analytics** - Track user behavior
5. **Premium features** - Add payment integration

---

**Ready to start?** Go to Step 1 and create your GitHub repo! 🎯
