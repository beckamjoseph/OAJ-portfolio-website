# OAJ Portfolio — Full Stack Setup Guide

```
portfolio-project/
├── frontend/
│   ├── index.html              ← Main portfolio page
│   └── assets/
│       └── videos/
│           ├── README.txt      ← Instructions for adding your videos
│           ├── campaign.mp4    ← UPLOAD: Card 01 preview clip
│           ├── reels.mp4       ← UPLOAD: Card 02 preview clip
│           ├── brand.mp4       ← UPLOAD: Card 03 preview clip
│           └── music.mp4       ← UPLOAD: Card 04 preview clip
└── backend/
    ├── server.js               ← Express API (email endpoint)
    ├── package.json
    ├── .env.example            ← Copy to .env and fill in credentials
    └── .env                    ← ⚠️  Never commit this to GitHub!
```

---

## STEP 1 — Set Up the Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your Gmail credentials:

```
EMAIL_USER=seyij556@gmail.com
EMAIL_PASS=your_16_char_app_password   # See instructions below
EMAIL_TO=seyij556@gmail.com
FRONTEND_URL=http://localhost:5500
```

### How to get your Gmail App Password
1. Go to → https://myaccount.google.com/security
2. Enable **2-Step Verification** (required)
3. Search for **"App Passwords"**
4. Select App: **Mail** / Device: **Windows Computer**
5. Copy the 16-character password into `.env` as `EMAIL_PASS`

Start the backend:
```bash
npm run dev      # development (auto-restart)
npm start        # production
```

The API will run at `http://localhost:5000`

---

## STEP 2 — Add Your Videos

Drop your MP4 clips into `frontend/assets/videos/`:

| File name       | Portfolio card                  |
|----------------|---------------------------------|
| `campaign.mp4` | Card 01 — Social Media Campaigns |
| `reels.mp4`    | Card 02 — Reels & TikToks        |
| `brand.mp4`    | Card 03 — Brand & Marketing      |
| `music.mp4`    | Card 04 — Music Video Edits      |

**Tips:**
- 10–30 second clips work best (they autoplay muted on hover)
- Export at 720p/1080p H.264 for browser compatibility
- Keep each file under 15 MB

---

## STEP 3 — Update Your Links

Open `frontend/index.html` and search for these tags:

| Tag                  | What to update                          |
|---------------------|-----------------------------------------|
| `GOOGLE_DRIVE_LINK`  | Your Google Drive portfolio folder URL  |
| `VIDEO_SRC_01..04`  | `data-video` on each card (if using URLs instead of local files) |
| `data-link` on cards | YouTube / TikTok / Drive links for Watch buttons |
| `BACKEND_URL`        | Your deployed API URL (production only) |

---

## STEP 4 — Run Everything Together

**Terminal 1 (backend):**
```bash
cd backend && npm run dev
```

**Terminal 2 (frontend):**

Option A — VS Code Live Server extension (recommended)
  Right-click `frontend/index.html` → Open with Live Server

Option B — npx serve
```bash
npx serve frontend
```

---

## DEPLOYING TO PRODUCTION

### Frontend
Upload the entire `frontend/` folder to any static host:
- **Netlify**: drag & drop the folder at netlify.com/drop
- **Vercel**: `vercel --cwd frontend`
- **GitHub Pages**: push to a repo, enable Pages

### Backend
Deploy `backend/` to a Node.js host:
- **Render.com** (free tier): connect your GitHub repo, set root to `backend/`
- **Railway.app**: similar process
- **Heroku**: `heroku create` inside the `backend/` folder

After deploying the backend, update `BACKEND_URL` in `frontend/index.html`:
```js
const BACKEND_URL = "https://your-api.onrender.com";
```

And update `FRONTEND_URL` in your production `.env`:
```
FRONTEND_URL=https://your-portfolio-site.netlify.app
```

---

## QUESTIONS?

Email: seyij556@gmail.com
