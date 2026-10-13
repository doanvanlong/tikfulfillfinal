# v19 — One Profit Per Order ID

- Mỗi Order ID chỉ có **một Profit ở dòng đầu tiên của Order ID trên tab Orders** (cột P). Dòng item thứ 2+ để trống cột P.
- Cột K (Total Money) giữ nguyên dữ liệu TikTok gốc dù lặp ở các items; **chỉ sử dụng giá trị K ở dòng Sheet đầu tiên khi tính**. Không xóa dữ liệu nhập từ TikTok.
- Mỗi item tiếp tục nhập FF Price riêng tại cột O.
- Công thức Profit tại dòng đầu: `=IF(AND(COUNTIF($B$2:$B;B27)>0;COUNTIF($B$2:$B;B27)=COUNTIFS($B$2:$B;B27;$N$2:$N;"TRUE";$O$2:$O;">0"));K27-SUMIF($B$2:$B;B27;$O$2:$O);"")` (ví dụ đơn bắt đầu ở dòng 27).
- Chỉ có Profit nếu **tất cả items** FF=TRUE và tất cả FF Price>0; không đủ điều kiện thì để trống.
- Website hiển thị Profit ở dòng tổng của đơn nhiều items, không hiển thị lặp trong dòng item.
- Đồng bộ web ↔ Sheet mỗi 30 giây và mỗi lần lưu; không đổi tên tab, không đổi cột.
- Các công thức Profit cũ ở những dòng item sau dòng đầu được dọn trong lần đồng bộ đầu tiên. **Sao lưu Sheet trước khi áp dụng.**
