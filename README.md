# NINJAGO: Rise of the Ninja — 3D fan-game prototype

A browser-based 3D open-world prototype built with Three.js. Designed for iPhone/mobile browsers and desktop. It includes Kai as the player, ninja NPCs, a third-person camera, story and sandbox modes, mission progression, dialogue/cutscene cards, spinjitzu, attacks, jumping, mask/unmask toggle, and a stylized explorable map with destination landmarks.

## Run locally
1. Install Node.js 18 or newer.
2. In this folder run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

## Deploy to Render
1. Push the contents of this folder to a GitHub repository (upload the files, not a ZIP nested inside the repo).
2. In Render choose **New → Web Service** and connect the repository.
3. Render detects `render.yaml`, or use:
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
4. Deploy. The game is served over HTTPS.

## Controls
- Desktop: WASD / arrow keys move; mouse drag rotates camera; Space jumps; J attacks; K spinjitzu; E interacts; M opens map; B switches story/sandbox.
- Mobile: left virtual joystick; buttons for attack, spinjitzu, jump, action; map and sandbox buttons.

## Important scope notes
This is a playable foundation, not a finished AAA-sized GTA-scale game. The city is a compact stylized prototype map, character rigs are procedural blocky placeholders, and the season campaign is an original fan-game chapter outline rather than a full recreation of every episode. The next production pass should replace the placeholder rigs and buildings with properly modeled, animated assets; add voice/audio, authored cinematic camera tracks, combat AI, interiors, traffic, save data, and expanded districts.

NINJAGO and its characters/world are the property of their respective rights holders. This is an unofficial fan project; public distribution or monetization may require permission. Avoid presenting it as an official LEGO product.
