#!/bin/bash
set -e

PARALLEL_JOBS=16

upload_tile() {
  file="$1"
  webp_key="tiles/${file#public/tiles/}"
  webp_key="${webp_key%.png}.webp"

  magick "$file" -quality 95 webp:- | \
    CLOUDFLARE_ACCOUNT_ID=8c13ab7fc53dc5dfb06c42c05a0e58eb \
    wrangler r2 object put "alaria/$webp_key" \
      --pipe \
      --content-type image/webp \
      --cache-control "public, max-age=31536000" \
      --remote 2>/dev/null

  echo "Uploaded: $webp_key"
}

export -f upload_tile

echo "Starting parallel WebP upload with $PARALLEL_JOBS jobs..."

# Upload config.json first
CLOUDFLARE_ACCOUNT_ID=8c13ab7fc53dc5dfb06c42c05a0e58eb \
  wrangler r2 object put "alaria/tiles/config.json" \
    --file public/tiles/config.json \
    --content-type application/json \
    --cache-control "public, max-age=31536000" \
    --remote

echo "Config uploaded. Starting tiles..."

# Find all PNGs and upload in parallel
find public/tiles -name "*.png" | xargs -P $PARALLEL_JOBS -I {} bash -c 'upload_tile "$@"' _ {}

echo "All uploads complete!"
