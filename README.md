# spoonysite

Personal site for Spoony Duder.

## Mixtape hosting quick start

1. Place your release-ready files in `songs/mixtape/`.
2. Copy `.env.example` to `.env` and paste your Backblaze credentials (never commit `.env`).
3. Install the Backblaze `b2` CLI.
4. Run `./scripts/upload_mixtape.sh` to mirror `songs/mixtape` to the `MAINMIXTAPE` bucket.
5. Generate per-track URLs with `b2 file-url`.
6. Paste the URLs (and any metadata you want to show) into `scripts/mixtape-tracks.js` so `mixtape.html` can render the Backblaze-powered player automatically.

See [docs/mixtape-hosting.md](docs/mixtape-hosting.md) for the detailed walkthrough and security reminders.
