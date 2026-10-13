# v31 — Xuất FS đúng Order ID và từng item

- Khi nhiều đơn được checked, chọn item theo Line UID, không dùng thứ tự checkbox hoặc vị trí dòng UI.
- Nhóm các dòng theo Order ID, đơn mới trước, từng item theo thứ tự dòng Google Sheets.
- Mỗi item xuất một dòng FS, A luôn ghi Order ID gốc của item đó, kể cả một đơn có nhiều item.
- Mỗi dòng có Quantity, Variant ID, Design Front/Back, Mockup Front/Back riêng.
- Thông tin chung Shipping method, Customer name, Label PDF nằm ở item được xuất đầu tiên của Order ID đó.
- Luôn ghi đè A:Z của các dòng xuất trên bản sao XLSX, xóa nội dung cũ sau dòng cuối nếu có; giữ vùng tiêu đề 1–3 và định dạng mẫu.
- Đã thêm bước kiểm tra Order ID + Line UID trước khi xuất và Quantity hợp lệ.

Lưu ý: chọn nhiều items trong một đơn vẫn chỉ tính một đơn trong badge. File FS có một dòng cho mỗi item được chọn.
