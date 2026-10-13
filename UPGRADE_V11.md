# TikFulfill v11 — Group Orders & newest first

## Thay đổi
- Một **Order ID = một đơn** trên website; mọi dòng Google Sheet có cùng Order ID trở thành các items của đơn đó.
- Nút **Xem N items** để mở/đóng tất cả sản phẩm; mỗi item có checkbox, sửa nhanh Variant ID, và nút Fulfillment riêng.
- Trang Orders và trang Cần Fulfill, tìm kiếm, lọc shop, mặt in, phân trang: áp dụng ở cấp **đơn**; đơn được xem là hoàn thành khi **tất cả items** có cột M = TRUE.
- Mới nhất lên đầu theo **số dòng cuối cùng** của đơn trên Sheet (cột N Line UID vẫn dùng để định vị; giao diện không ghi đảo trật tự dữ liệu Sheet).
- Payout (J) được tính **một lần trên một Order ID**; tổng chi phí = tổng cost × quantity của từng item. Giả định J là tổng payout lặp lại trên mọi dòng trong đơn (đúng như ví dụ 3 dòng $34.89 của bạn).
- Export Excel vẫn giữ **một dòng/item** cho nhà in; Payout chỉ được điền ở item đầu tiên của đơn, không cộng trùng. Lịch sử xuất ghi số **đơn**.
- Chọn checkbox cha áp dụng toàn bộ Line UID bên trong; checkbox con áp dụng riêng item. Nút bulk TRUE/FALSE vẫn sửa từng dòng Sheet qua Line UID cột N + Order ID.
- Hệ thống tiếp tục đọc Sheet mỗi 30 giây và làm mới UI sau lưu.

## Lưu ý về dữ liệu
- Trên Google Sheets vẫn duy trì **một dòng cho mỗi item**, tuyệt đối không gộp các dòng Sheet.
- Cột N cần chứa **Line UID duy nhất** (source tự tạo cho các dòng chưa có).
- Nếu dữ liệu cột J thực ra là **payout từng item** chứ không phải payout tổng đơn lặp lại thì cần đổi công thức trước khi dùng phần thống kê. Nếu các items có ngày khác nhau, nguồn sắp xếp là dòng cuối cùng trong Sheet, không phải ngày.
- Đơn có trạng thái hỗn hợp được tính là **Cần Fulfill** đến khi mọi item hoàn thành.
- Giao diện ghi theo từng item, không lấy số dòng hiển thị làm khóa. Sau sắp xếp/đưa đơn mới vào Sheet, phương thức ghi sẽ tra lại UID và Order ID để tìm đúng dòng.

## Chạy
`npm run dev` rồi mở http://127.0.0.1:3000 . Thiết lập `.env` như v10. **Không đưa refresh token/secret vào frontend**. Deploy Vercel sử dụng cùng API Node và env riêng.
