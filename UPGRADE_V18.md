# v18 – Một Label PDF cho mỗi Order ID

- Đơn 1 item: giữ nguyên link Label PDF trên dòng sản phẩm.
- Đơn từ 2 items: Label PDF chỉ hiển thị **một lần ở dòng tổng**, bên dưới Payout / đơn.
- Ưu tiên URL hợp lệ ở **dòng Sheet có chỉ số nhỏ nhất** của Order ID. Nếu trống hoặc URL không hợp lệ, lấy URL hợp lệ đầu tiên từ các dòng tiếp theo.
- Không lặp link Label PDF ở những dòng item mở rộng.
- Không thay đổi cấu trúc Google Sheets, việc lưu theo Line UID, hay cách xuất Excel.
- Mỗi item vẫn có thể chỉnh dữ liệu riêng trong drawer Fulfillment như trước.

Lưu ý: nếu các dòng của cùng Order ID có Label khác nhau, màn hình nhóm chỉ hiển thị link được ưu tiên; bản v18 **không** xóa hoặc ghi đè các Label còn lại trong Google Sheets.
