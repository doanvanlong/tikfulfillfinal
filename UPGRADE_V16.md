# TikFulfill v16 — FF Price & Profit

- Orders: O = FF Price (USD), P = Profit, Q = Line UID. N remains FF and K remains Total Money.
- Website reads FF Price and calculates profit as K minus O, supports editing FF Price inline and in Fulfillment drawer.
- Profit cells are Google Sheets formulas (`=IF(OR(K2="",O2=""),"",K2-O2)`) so direct Sheet edits recompute.
- Existing v15 sheet is auto-migrated by inserting two columns before O (Line UID). Back up the Sheet first.
- For multi-item orders, each item gets its own FF Price and per-row Profit (K - O); the website's overall profit avoids duplicate payouts by summing payout once per Order ID and costs across items.
- If FF Price is blank, Profit remains blank (not an assumed zero cost).
- Use `.env` from your existing installation.
