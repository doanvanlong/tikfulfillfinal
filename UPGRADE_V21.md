# TikFulfill v21 — Config & Instant Design Autofill

## Trang Cấu hình

- Tab **Cấu hình** cho phép chỉnh danh sách màu Light/Dark, mỗi màu một dòng.
- Không phân biệt chữ hoa/thường, giữ nguyên ý nghĩa khoảng trắng giữa các từ. `LIGHT BLUE` tương đương `Light Blue`, nhưng `LightBlue` không khớp.
- Chống trùng màu trong và giữa hai nhóm. Màu chưa cấu hình không được tự gán sang một nhóm khác.
- Lưu vào tab Google Sheets `ColorConfig` với các cột `Tone`, `Color`, `Updated At`. Chỉ khi người dùng bấm **Lưu cấu hình** mới cập nhật tab này.
- Khi tab `ColorConfig` chưa có dữ liệu, dùng danh sách mặc định tại giao diện; không cần tạo giá trị giả trong tab.

## Auto fill khi đổi Mặt in

- Chỉnh `Front`, `Back`, `Front+Back` trực tiếp trên Orders sẽ gọi `saveFulfillment` theo `Line UID` và lưu giá trị tại `Orders!G`, đồng thời upsert design đã map vào tab `Fulfillment`.
- Sử dụng SKU + màu ở Variation để tra nhóm Light/Dark và 4 link trong `DesignLibrary`.
- Với Front chỉ sử dụng Front tương ứng; Back chỉ dùng Back; Front+Back yêu cầu cả 2.
- Nếu màu không cấu hình, không đoán Light/Dark; giữ các link thủ công phù hợp mặt in hiện tại và hiện cảnh báo.
- Đơn nhiều items vẫn cập nhật từng dòng riêng, không cập nhật cả Order ID.

## Cấu trúc DesignLibrary v20

`SKU | Product Name | Print Sides | Design Front Light | Design Back Light | Design Front Dark | Design Back Dark | Mockup Link | Updated At`

## Cài đặt

Sao lưu spreadsheet, giữ `.env` cũ, chạy `npm run dev`. Mở `http://127.0.0.1:3000`. Tab `ColorConfig` tự được tạo khi đồng bộ. Vercel sử dụng các biến môi trường như trước.

**Lưu ý:** Cấu trúc đã được kiểm tra cú pháp nhưng chưa chạy với Google Sheets thực do cần quyền tài khoản của bạn.
