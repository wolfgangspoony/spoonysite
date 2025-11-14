# Mixtape Hosting Workflow

This project now ships with a predictable place for mixtape audio (`songs/mixtape`) and a helper script that pushes the contents of that folder to Backblaze B2. Follow the steps below before wiring the tracks into a page-level audio player.

## 1. Prepare your audio files

1. Drop the mastered .mp3 or .wav files for the release into `songs/mixtape/`.
2. Keep filenames URL-safe (letters, numbers, dashes, underscores) so they can become part of a download link later.
3. Commit only the files you are comfortable making public. For private masters, keep them out of git and upload them manually.

## 2. Configure Backblaze credentials

1. Copy `.env.example` to `.env` at the project root.
2. Paste your **Key ID** and **Application Key** into the new file. _Never commit `.env`._
3. Adjust `B2_BUCKET_NAME` if you are using something other than `MAINMIXTAPE`.

> :warning: Rotate the master credentials you previously shared in chat and store the replacements only inside `.env` so they never leak via git.

## 3. Install the Backblaze CLI

```bash
pip install b2
# or
brew install --cask backblaze-b2
```

Any installation method that gives you the `b2` command-line tool will work.

## 4. Upload the mixtape assets

Run the helper script from the project root:

```bash
./scripts/upload_mixtape.sh
```

The script will:

- load credentials from `.env`
- authorize against B2
- sync `songs/mixtape` with the `MAINMIXTAPE` bucket (adding, updating, and deleting files so it mirrors your repo)

When the sync finishes, generate sharable links for each file:

```bash
b2 file-url MAINMIXTAPE track-name.mp3
```

Record those URLs somewhere safe—you will plug them into the eventual player page.

## 5. Reference the hosted files

Until the player UI exists, you can still confirm the hosting pipeline by dropping the generated URLs into any browser or by using a temporary `<a>` download link inside `music.html`. Once you are ready to build the player, point the `<audio>` sources to the same URLs so playback happens directly from Backblaze.

## 6. Wire the Backblaze links into the mixtape page

The repo now ships with `mixtape.html`, which renders a full tracklist driven by `scripts/mixtape-tracks.js`.

1. Open `scripts/mixtape-tracks.js` and replace the placeholder data with the tracks you uploaded.
2. For each track, paste the exact `streamUrl` (and optionally `downloadUrl`) value returned by `b2 file-url`.
3. Update the title, description, and duration fields so the UI matches what listeners should see.
4. Deploy the site. The JavaScript on `mixtape.html` will re-render itself with the new data automatically.

Because the player consumes direct Backblaze URLs, keeping `scripts/mixtape-tracks.js` in sync with your bucket is all it takes to keep the site up-to-date.
