#!/bin/bash
set -e

PARALLEL_JOBS=8
SRC_DIR="public/tiles-webp"

echo "Uploading WebP tiles to R2..."

upload_tile() {
  file="$1"
  key="tiles/${file#public/tiles-webp/}"

  CLOUDFLARE_ACCOUNT_ID=8c13ab7fc53dc5dfb06c42c05a0e58eb \
    wrangler r2 object put "alaria/$key" \
      --file "$file" \
      --content-type image/webp \
      --cache-control "public, max-age=31536000" \
      --remote 2>/dev/null

  echo "Uploaded: $key"
}

export -f upload_tile

# Upload config.json first
CLOUDFLARE_ACCOUNT_ID=8c13ab7fc53dc5dfb06c42c05a0e58eb \
  wrangler r2 object put "alaria/tiles/config.json" \
    --file "$SRC_DIR/config.json" \
    --content-type application/json \
    --cache-control "public, max-age=31536000" \
    --remote

echo "Config uploaded. Starting tiles for all zoom levels in parallel..."

# Upload each zoom level in parallel (each with its own parallel jobs)
for z in 0 1 2 3 4 5; do
  (
    find "$SRC_DIR/$z" -name "*.webp" | xargs -P $PARALLEL_JOBS -I {} bash -c 'upload_tile "$@"' _ {}
    echo "Zoom level $z complete!"
  ) &
done

# Wait for all zoom levels to finish
wait

echo ""
echo "All uploads complete!"
