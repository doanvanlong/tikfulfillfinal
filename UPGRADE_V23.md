# TikFulfill Studio v23 — Orders + Design UI

- Cân lại 9 cột Orders với `table-layout: fixed`, ưu tiên cột sản phẩm (27%) và Order ID (15%); bảng cuộn ngang trên màn hình nhỏ.
- Bỏ nút “Tự động điền đơn thiếu” khỏi dashboard. Auto-fill khi đổi mặt in ở từng item vẫn giữ nguyên.
- Thư viện Design: giới hạn chiều rộng tên sản phẩm và hiển thị tối đa 2 dòng; hover để xem tên đầy đủ.
- Thêm nút **Sửa**: điền toàn bộ record theo SKU vào form, khóa SKU trong lúc sửa, lưu cập nhật bằng `saveDesign` (upsert), hoặc Hủy sửa.
- Giữ nguyên Google Sheets API, DesignLibrary schema 4 link, Config màu Light/Dark và Fulfillment.
- Chưa kiểm tra thực tế ghi Google Sheets của tài khoản. Hãy sao lưu Sheet trước khi kiểm thử.
