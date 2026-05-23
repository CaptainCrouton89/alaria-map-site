# CLAUDE.md

## Constraints

- **Leaflet coordinate system**: The map uses `L.CRS.Simple` with pixel coordinates. Y-axis is flipped when placing markers — Leaflet has bottom-left origin, images have top-left. Always invert Y when converting image pixel coords to `L.LatLng`.
