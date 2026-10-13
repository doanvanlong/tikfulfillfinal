# TikFulfill v15 – Print Placement đồng bộ trực tiếp Orders!G

**Sao lưu Google Sheets trước lần kết nối đầu.**

- Tab Orders: chèn cột **G = Print Placement** sau F = Image URL.
- Các cột cũ dịch: H Meta Order, I Quantity, J SKU, K Total Money, L Label URL, M Acc, N FF, O Line UID.
- Khi nhận diện layout cũ (G Meta Order, H Quantity, N Line UID), API tự **chèn cột mới**, không ghi đè G cũ. Nếu đã chèn G trống và H là Meta Order, chỉ đặt tiêu đề G.
- Nếu không khớp schema dự kiến, API ngừng đồng bộ và báo lỗi thay vì đoán vị trí cột.
- Chọn Front/Back/Front+Back trên website ghi vào **Orders!G** của item theo **Line UID + Order ID**; sửa cột G tại Sheet sẽ đồng bộ lên website tối đa khoảng 30 giây.
- `Fulfillment!L` không còn là nguồn giá trị Print Placement; dữ liệu cũ ở cột này không được xoá.
- Mặt in trống trên Sheet được hiển thị mặc định dựa vào SKU (1M = Front, 2M = Front+Back) mà **không tự điền** G. Nếu muốn ghi mặc định, hãy chọn và lưu trên website.
- Đơn một item giữ một dòng; nhiều items có dòng tổng và phần mở rộng.
- Chuyển trạng thái và bulk TRUE/FALSE dùng cột N; các cột khác đã được cập nhật chỉ số.

Sau khi cập nhật, chạy `npm run dev`. Kiểm tra G/H/I/J/K/L/M/N/O đúng trước khi chỉnh đơn thật.
