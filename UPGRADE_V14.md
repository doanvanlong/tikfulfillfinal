# TikFulfill Studio v14 — Gộp thông tin sản phẩm và sửa Mặt in

## Giao diện Orders
- Bỏ hai cột riêng `Variation · SL` và `Mã SKU · Mặt in`.
- Gộp tên sản phẩm, ảnh mockup, màu/size, số lượng, SKU và bộ chọn Mặt in vào cột `Sản phẩm · Variation · SKU · Mặt in`.
- Đơn một item vẫn là một dòng; đơn nhiều items vẫn gộp một dòng tổng và có nút mở riêng từng item.
- Bộ chọn Mặt in cho mỗi Line UID: `Front`, `Back`, `Front + Back`.

## Google Sheets
- Lựa chọn Mặt in được lưu ở tab `Fulfillment`, cột L mới là `Print Placement`. Hệ thống bổ sung tiêu đề cột L khi nhận diện đúng schema v13.
- Các cột A–N của tab `Orders` không bị thay đổi khi sửa Mặt in.
- Nếu không có thiết lập riêng, SKU đuôi `2M` mặc định `Front + Back`, các SKU khác mặc định `Front`.
- Thiếu Design chỉ tính các mặt đang được chọn; không dùng quy tắc mặc định SKU để ghi đè thiết lập thủ công.
- Drawer Fulfillment cũng có bộ chọn Mặt in và yêu cầu đúng link Design cho lựa chọn khi đánh dấu TRUE.
- Excel xuất kèm `Print Placement`.

## Cài đặt
Giữ file `.env` cũ (không đưa vào ZIP). Chạy `npm run dev` trên localhost; khi deploy Vercel giữ nguyên các Environment Variables hiện có.

## Kiểm thử đề nghị
1. Backup Google Sheets trước khi mở bản v14 lần đầu.
2. Đổi một item từ Front sang Back; kiểm tra Fulfillment!L và trạng thái Front/Back trên web.
3. Đổi sang Front + Back, kiểm tra cảnh báo nếu thiếu một mặt.
4. Đổi các item khác nhau trong cùng Order ID; xác nhận không ảnh hưởng lẫn nhau.
5. Đồng bộ lại và xác minh lựa chọn vẫn tồn tại.

Chưa kiểm thử kết nối thực tế với tài khoản Google Sheets của người dùng.
