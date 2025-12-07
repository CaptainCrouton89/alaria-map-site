#!/bin/bash

BASE_URL="https://pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev"
MISSING_FILE="missing-tiles.txt"

> "$MISSING_FILE"

check_tile() {
  file="$1"
  key="tiles/${file#public/tiles-webp/}"
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$key")
  if [ "$code" = "404" ]; then
    echo "$file" >> "$MISSING_FILE"
  fi
}

export -f check_tile
export BASE_URL
export MISSING_FILE

find public/tiles-webp -name "*.webp" | xargs -P 8 -I {} bash -c 'check_tile "$@"' _ {}

count=$(wc -l < "$MISSING_FILE")
echo "Found $count missing tiles. List saved to $MISSING_FILE" >&2
