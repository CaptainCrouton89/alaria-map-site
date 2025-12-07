#!/bin/bash
set -e

PARALLEL_JOBS=4

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

count=$(wc -l < missing-tiles.txt)
echo "Re-uploading $count missing tiles with $PARALLEL_JOBS parallel jobs..."

cat missing-tiles.txt | xargs -P $PARALLEL_JOBS -I {} bash -c 'upload_tile "$@"' _ {}

echo ""
echo "Re-upload complete!"
