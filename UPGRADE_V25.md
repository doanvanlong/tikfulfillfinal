# TikFulfill Studio v25 — HEX shirt colors & paired Preview

## New Config input
Each line: `Color Name-#RRGGBB`, e.g. `Ash-#c8c8c8`, `Black-#202125`.
Matching remains case-insensitive but preserves internal spaces. The Google Sheets `ColorConfig` tab continues using its original `Tone`, `Color`, `Updated At` columns; the `Color` cell contains the entire `Name-#HEX` string.

Existing entries without HEX remain readable for tone mapping, but require adding HEX in Config before Preview can use that exact color. Saving rejects duplicates by color **name**, regardless of HEX. Old entries are not silently recolored.

## Preview
- Front only → one shirt with Front design.
- Back only → one shirt with Back design.
- Front+Back → two side-by-side shirts with Front and Back designs.
- Each shirt uses the user's exact configured HEX, not a guessed hex.
- Missing/blocked image shows a warning, no substitute artwork.

## Deploy
Keep your existing `.env` locally or Vercel Environment Variables. `npm run dev` then open localhost. No new secrets/config keys.

## Verification
JavaScript syntax verified. Google Sheets OAuth operations / actual remote Design image loading have not been end-to-end tested. Backup Sheet before changing your saved ColorConfig.
