# 📁 frontend/assets/videos/

Drop your portfolio video files into this folder.
The frontend HTML references them by filename — see the table below.

────────────────────────────────────────────────────────────
  CARD  │  FILENAME TO USE            │  SECTION
────────────────────────────────────────────────────────────
  01    │  campaign.mp4               │  Social Media Video Campaigns
  02    │  reels.mp4                  │  Short-Form Reels & TikToks
  03    │  brand.mp4                  │  Brand & Marketing Videos
  04    │  music.mp4                  │  Music Video Edits
────────────────────────────────────────────────────────────

TIPS
────
• Keep each clip 10–30 seconds (they autoplay muted on hover).
• Export at 720p or 1080p, H.264 codec for best browser support.
• File size target: under 15 MB per clip so they load fast.
• If you'd rather link to YouTube or Google Drive videos, open
  frontend/index.html and search for "VIDEO_SRC_" — each card
  has a clearly labelled placeholder comment.

SUPPORTED FORMATS
─────────────────
  .mp4  (recommended — works in all browsers)
  .webm (smaller files, works in Chrome/Firefox)

EXAMPLE FOLDER LAYOUT WHEN DONE
──────────────────────────────────
  frontend/
  └── assets/
      └── videos/
          ├── campaign.mp4      ← Card 01
          ├── reels.mp4         ← Card 02
          ├── brand.mp4         ← Card 03
          └── music.mp4         ← Card 04
