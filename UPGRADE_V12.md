# TikFulfill v12 - Single-item display

- Orders containing exactly one item render as a single editable row as in v10 (no expand/collapse and no nested line).
- Orders containing two or more items retain the expandable parent + item rows from v11.
- Both layouts bind Variant ID, checkbox, and Fulfillment actions to the item's Line UID.
- Newest orders still appear first; Google Sheets rows are not rearranged.
- Grouped order counts and payout calculation remain one count per Order ID.

Run with `npm run dev` after setting `.env` locally. Do not commit `.env`.
