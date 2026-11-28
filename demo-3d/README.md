# CasaMea 3D demo

A sample apartment (about 54 m²) built with three.js and furnished with the Kenney Furniture Kit.

- **Dollhouse**: the home seen from above with the roof cut away. Drag to rotate, pinch or scroll to zoom.
- **Walk**: eye-level walk-through. Arrow keys or WASD on a computer, the on-screen stick on a phone. Walls and furniture block you.
- **Tour**: a 30-second guided tour of every room.
- **Styles**: Scandinavian, Modern Luxury and Family Friendly change colours, materials and some furniture with a smooth fade.
- **Evening**: switches on the lamps.

The furniture models are packed into `models.json` (base64 GLB) so the page needs no extra files.
The full kit, 140 GLB models, is in `../assets/kenney-furniture/` (CC0, see LICENSE.txt).

Open `demo-3d/index.html` through a web server (for example GitHub Pages), not as a local file, because the page loads `models.json`.
