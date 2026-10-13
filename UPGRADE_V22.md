# TikFulfill Studio v22 – UI Layout Fix

- Đưa `configPage` vào bên trong `<main class="shell">` để đồng nhất chiều rộng với các tab còn lại.
- Khóa chiều rộng các panel và textarea của tab Cấu hình nhằm ngăn tràn ngang.
- Làm nút `Lưu Design` gọn, nằm trong footer riêng của form, không kéo giãn theo cột grid.
- Không thay đổi các hàm Google Sheets API, cách lưu Config, Variant, Design hoặc Fulfillment.

Chạy `npm run dev` như các phiên bản trước, giữ nguyên file `.env`.
