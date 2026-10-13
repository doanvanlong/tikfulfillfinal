# v32 — CSV Pressify theo mẫu tải lên

- Mẫu CSV cố định: `templates/tiktok-presstify.csv` (22 cột A–V nguyên bản).
- Chỉ xuất item FF = FALSE đã checked, mỗi item một dòng, bắt đầu dòng 2.
- Mỗi dòng chứa Order ID gốc và dữ liệu riêng theo Line UID, bao gồm các đơn nhiều items.
- B = `new_order`; C = tên sản phẩm; D = Variant ID; E = Quantity.
- F/G = Mockup Front/Back; H/I = Front/Back Design, điền theo mặt in thực tế.
- U = Shipping Label PDF của đơn (có thể lặp lại mỗi item); V = `standard`.
- J–T để trống vì không có dữ liệu Sleeve/địa chỉ trong Orders.
- Giữ nguyên CSV header chính xác từ mẫu; UTF-8 BOM để Excel hỗ trợ Unicode.
- Local server cho phép tải file mẫu CSV từ thư mục templates.
