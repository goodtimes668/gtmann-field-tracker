# GT Mann Field Tracker

Voice-in field accountability tracker that captures site activities throughout the day and auto-classifies them to HH2 cost codes. Built to eliminate after-hours unpaid time entry.

## What it does

1. Tap big yellow button → speak what you’re doing
1. App transcribes voice live, suggests the right cost code (Foreman, GTM Rough Carpentry, etc.) based on what you said
1. One tap confirms, one tap to change the code if it got it wrong
1. End of shift → tap Summary tab → see hours per cost code, totals ready to type into HH2 in 2–3 minutes during cleanup
1. All data stored on-device (IndexedDB). Works offline. No login, no backend, no API keys.

## Files

|File           |Purpose                                                |
|---------------|-------------------------------------------------------|
|`index.html`   |Whole app — HTML, CSS, JS embedded                     |
|`manifest.json`|PWA manifest, makes it installable on phone home screen|
|`sw.js`        |Service worker, caches the app shell for offline use   |

## Deploy to Netlify

Same flow as ToolVault Pro and Dispatch:

1. Create a new GitHub repo (suggested name: `gtmann-field-tracker`)
1. Push these three files to the repo root
1. In Netlify: Add new site → Import from GitHub → pick the repo
1. Build settings: leave blank (no build command, no publish dir override). Netlify auto-detects.
1. Deploy. You’ll get a URL like `gtmann-field-tracker.netlify.app`

## Install on your phone (PWA)

**iOS Safari:**

1. Open the Netlify URL in Safari
1. Tap Share → Add to Home Screen
1. App icon appears like a native app. Mic permissions are requested on first record.

**Android Chrome:**

1. Open the URL in Chrome
1. Tap menu → Install app (or “Add to Home Screen”)
1. Same deal.

## Usage on site

- **Record:** Tap the big yellow circle. Speak naturally — “Coordinating with Will on vented soffit fourth floor deck unit B4” or “Framed wall in electrical closet 304.”
- **Stop:** Tap the red square when done.
- **Confirm:** Modal pops up with auto-suggested cost code. If right → adjust duration (default 15 min, use ±15 buttons) → Save. If wrong code → tap the right one in the grid → Save.
- **Summary:** Tap Summary tab anytime to see today’s hours per cost code with copy buttons.
- **Export:** Bottom of Summary → “Export Evidence Report” gives you a `.txt` file of the full day’s log — your pitch ammunition.

## Cost code classifier

Currently uses keyword matching against the 9 codes you use on Grand & Fir:

- **#11206.000 Foreman** — coordinating, planning, decisions, drawings, site walks, RFIs
- **#11207.000 Safety / OFA** — toolbox talks, first aid, PPE, hazards
- **#5220.000 GTM Rough Carpentry & Steel** — framing, blocking, backing, sheeting, steel
- **#4122.000 GTM Concrete Labour** — pour, forms, rebar, stripping
- **#4112.000 Slab Preparation** — slab prep, subgrade, vapor barrier
- **#10220.000 Cleaning & General Labour** — sweep, debris, cleanup
- **#12160.000 Shipping** — deliveries, unloading, materials handling
- **#3310.000 Site Preparation** — excavation, grading, fill
- **#3325.000 Dewatering** — pumping, drainage

To tune the classifier (add keywords for codes that mis-tag), edit the `COST_CODES` array near the top of the `<script>` block in `index.html`.

## What’s NOT in this MVP (Phase 2/3 backlog)

- Claude API for AI-driven classification (handles ambiguous cases better than keywords)
- Backend sync (Railway) — currently all data is on-device only. If you wipe browser data, you lose history.
- Multi-day history view (currently only “Today” is shown)
- GPS auto-tagging of location
- Audio backup recording (transcript only right now)
- PDF export of evidence report
- Multi-foreman support / project dashboards

## Pitch positioning

This tool produces clean inputs for HH2. It does **not** touch HH2 itself. That’s by design — hh2 has no public API, and reverse-engineering their system from a personal app would be unauthorized access to GT Mann’s payroll system. The story to Graeme and Michael:

> “I built a capture layer that runs alongside hh2. It means by the time I sit down at the daily timecard at end of shift, I know exactly what hours go to each cost code with timestamps backing each one. Takes 2-3 minutes instead of 30-60 reconstructing from memory. Same tool, rolled out to all foremen, gives the company accurate job costing data they currently don’t have.”

## Known limitations

- **Browser speech recognition quality varies.** Loud sites may cause misses. Use manual entry button as fallback.
- **Web Speech API requires internet** in some browsers (transcription itself, not the app). On iOS Safari it works offline. On Android Chrome it sometimes needs a brief sync.
- **No data backup** in this MVP. If you clear your browser data, captures are gone. Phase 2 adds sync.
