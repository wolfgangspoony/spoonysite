#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." &>/dev/null && pwd)"
ENV_FILE="${PROJECT_ROOT}/.env"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

: "${B2_KEY_ID:?Set B2_KEY_ID in .env before running this script.}"
: "${B2_APPLICATION_KEY:?Set B2_APPLICATION_KEY in .env before running this script.}"
B2_BUCKET_NAME="${B2_BUCKET_NAME:-MAINMIXTAPE}"
SOURCE_DIR="${B2_SOURCE_DIR:-songs/mixtape}"
if [[ "$SOURCE_DIR" != /* ]]; then
  SOURCE_DIR="${PROJECT_ROOT}/${SOURCE_DIR#./}"
fi

if ! command -v b2 >/dev/null 2>&1; then
  echo "The Backblaze B2 CLI (b2) is required. Install it from https://www.backblaze.com/b2/docs/quick_command_line.html"
  exit 1
fi

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Source directory '$SOURCE_DIR' not found."
  exit 1
fi

b2 authorize-account "$B2_KEY_ID" "$B2_APPLICATION_KEY"

# Sync audio assets to the bucket, keeping the directory tidy.
# --replaceNewer: ensures bucket files stay in sync with local versions.
# --delete: removes remote files that were deleted locally so the mixtape list stays accurate.
b2 sync --replaceNewer --delete "$SOURCE_DIR" "b2://$B2_BUCKET_NAME"

echo "Upload complete. Use 'b2 file-url <bucketName> <fileName>' to retrieve a public link for each track."
