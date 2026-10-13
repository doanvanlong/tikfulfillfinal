# v17 — Sửa Profit #ERROR! và điều kiện tính

Google Sheets locale Việt Nam dùng dấu `;` ngăn tham số công thức. Profit ở cột P được tự cập nhật lại theo dòng:

`=IF(AND(UPPER(TO_TEXT(N2))="TRUE";ISNUMBER(O2);O2>0);K2-O2;"")`

- Chỉ có kết quả khi N (FF) là TRUE và O (FF Price) là số > 0.
- Nếu FF FALSE, giá vốn trống, bằng 0 hoặc là văn bản không phải số: P trống.
- Đồng bộ tự sửa công thức cũ ở cột P, không cần chỉnh từng dòng.
- Website chỉ cộng lợi nhuận của đơn mà mọi item đều FF TRUE và có FF Price > 0, không cộng payout trùng cho đơn nhiều items.
- Giữ nguyên thứ tự và cấu trúc Orders A:Q, Line UID tại Q.

Lưu ý: công thức viết theo locale dấu chấm phẩy (Google Sheets vi-VN). Nếu spreadsheet dùng locale khác, chỉnh dấu phân tách phù hợp.
