# TikFulfill v10 — HTML + JavaScript + Google Sheets API

Uses the **same HTML/JS management UI** (Orders, Fulfillment, Variant Mapping, Design Library, Excel History) with a secure server-side Google token refresh adapter. No frontend OAuth sign-in. No React/Vite or npm dependencies.

## Run on localhost

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env`. Enter your **NEW** Google OAuth client ID, rotated client secret, newly issued refresh token, spreadsheet ID, and sheet name. Don't paste tokens in `index.html`, `sheets-api.js`, or in a public Git repo.
3. Run `node local-server.js` (or `npm run dev`).
4. Open **http://127.0.0.1:3000**. The page connects automatically; no Google sign-in and no APP_ACCESS_KEY prompt while testing locally.
5. Verify: add a test order in Sheet → it appears within 30 seconds. Edit its Fulfillment on web → values appear in the Fulfillment tab; editing quantity, label, or TRUE/FALSE writes designated Orders columns.

**Important:** `local-server.js` listens only on `127.0.0.1`; local password bypass is strictly for loopback and cannot be used on public Vercel. Opening HTML via `file://` is NOT supported.

## Deploy on Vercel

1. Upload project folder except `.env`, `local-server.js` is harmless but not used by Vercel. `api/google.js` becomes a Node serverless function; HTML/JS are static.
2. Project → Settings → Environment Variables: set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_SPREADSHEET_ID`, `GOOGLE_SHEET_NAME`, and **`APP_ACCESS_KEY`**.
3. Deploy/redeploy. Open site, enter your website access key (not your Google password) and click Connect. During the tab session, Google itself never asks you to log in. This key is mandatory in production to prevent strangers from reading/writing orders.
4. Do not enable `LOCAL_DEV_NO_AUTH` in Vercel.

## Google setup

- Enable Google Sheets API in your Google Cloud project.
- The account which produced the refresh token must have Editor access to the spreadsheet and a token with `https://www.googleapis.com/auth/spreadsheets` scope.
- Revoke the refresh token and rotate the secret previously pasted into chat. Use replacement credentials ONLY on the server.
- Export Excel needs internet access to load the XLSX library from CDN.

## What synchronizes

- `Orders`: reads A–N; preserves A–M source columns, adds a fixed `Line UID` to N. Editing order fields writes only the fields actually changed, and verifies Line UID + Order ID before each write.
- `Fulfillment`: stores variant, design front/back, mockup, quantity, label, status, notes per Line UID.
- `VariantMapping`, `DesignLibrary`, `ExportHistory`: stored in separate tabs, automatically created on first fetch.
- Polls new Google Sheet rows every ~30 seconds while the page is open. Pauses while the drawer is open to avoid overwriting unsaved form fields.

## Limits / security

- Google Sheets is polled, not instant push. Close/reopen tab to force an immediate refresh.
- Server proxy and APP_ACCESS_KEY are a small-team setup, not a full identity system. For shared public use, add proper accounts, rate limiting, audit logs, and per-user authorizations.
- Sheets writes are **not transactional**; concurrent editors can overwrite each other. Back up data and test on a COPY of the spreadsheet first.
- `APP_ACCESS_KEY` can be left as a placeholder for localhost testing; it is REQUIRED and must be strong in Vercel.

## v16: FF Price và Profit

Đã bổ sung ngay sau FF trong tab Orders: `O = FF Price`, `P = Profit`, `Q = Line UID`. Khi kết nối bản v15 lần đầu, API tự chèn 2 cột trước Line UID; **hãy sao lưu Sheet trước khi chạy**. Website cho phép nhập FF Price trong bảng và cửa sổ Fulfillment. Profit là `K - O`, có công thức trong Sheet, tự đổi khi sửa trực tiếp giá hoặc cost trên Sheet. Để trống cost thì Profit cũng để trống. Tổng lợi nhuận website tính payout một lần mỗi Order ID, trừ tổng FF Price của tất cả items.

## v17: Sửa công thức Profit
Xem `UPGRADE_V17.md`: cột P chỉ tính khi FF = TRUE và FF Price > 0. Phiên bản này sửa công thức lỗi `#ERROR!` cho Google Sheets dùng dấu `;`.


## v18 – Label cho đơn nhiều items
Một Order ID nhiều items chỉ hiển thị Label PDF tại dòng tổng, lấy URL hợp lệ đầu tiên theo thứ tự dòng trên Sheets. Chi tiết xem `UPGRADE_V18.md`.


## V26
- Preview đã bỏ silhouette áo, chuyển sang full nền màu theo HEX và hiển thị design full khung.
