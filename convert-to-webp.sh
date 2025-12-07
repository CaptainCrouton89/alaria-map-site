#!/bin/bash
set -e

PARALLEL_JOBS=16
SRC_DIR="public/tiles"
DEST_DIR="public/tiles-webp"

echo "Converting PNG tiles to WebP (q95) with $PARALLEL_JOBS parallel jobs..."

# Create destination directory structure
mkdir -p "$DEST_DIR"

convert_tile() {
  src="$1"
  dest_dir="$2"

  # Get relative path from source
  rel_path="${src#public/tiles/}"
  dest_path="$dest_dir/${rel_path%.png}.webp"

  # Create directory if needed
  mkdir -p "$(dirname "$dest_path")"

  # Convert
  magick "$src" -quality 95 "$dest_path"
  echo "Converted: $rel_path"
}

export -f convert_tile
export DEST_DIR

# Copy config.json
cp "$SRC_DIR/config.json" "$DEST_DIR/config.json"
echo "Copied config.json"

# Convert all PNGs in parallel
find "$SRC_DIR" -name "*.png" | xargs -P $PARALLEL_JOBS -I {} bash -c 'convert_tile "$@" "$DEST_DIR"' _ {}

echo ""
echo "Conversion complete!"
echo "Source tiles: $(find $SRC_DIR -name "*.png" | wc -l)"
echo "WebP tiles: $(find $DEST_DIR -name "*.webp" | wc -l)"
