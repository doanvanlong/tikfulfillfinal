# v13 — Chọn FALSE rồi mới xuất Excel

- Xóa hai nút Export cố định trên header và thống kê, cùng nút tạo export trong lịch sử.
- Chỉ hiện Xuất Excel ở thanh lọc khi ít nhất 1 item FALSE được chọn; số lượng badge tính theo **Order ID duy nhất** (tooltip cho biết số items FALSE).
- Checkbox TRUE bị khóa; chọn dòng tổng của order nhiều items chỉ chọn các dòng FALSE.
- Xuất đúng các Line UID được chọn, kể cả khi đã đổi lọc/phân trang; một Order ID nhiều items chỉ xuất các items FALSE được tick.
- Tăng font và chiều cao hàng trong bảng Orders, không tác động các trang khác.
- Giữ API Google Sheets localhost / Vercel.
