# TikFulfill v30 — Mẫu Excel FS lưu cố định

- Mẫu gốc ở `templates/tiktok-fs.xlsx`.
- Xuất FS bằng cách giữ nguyên ZIP XLSX và chỉ sửa XML của các ô từ dòng 4; định dạng, drawing, phần hướng dẫn, các cột A–AF được giữ nguyên.
- Cần tải JSZip CDN trên trình duyệt để tạo bản sao XLSX.
- Localhost phục vụ file mẫu từ `/templates/tiktok-fs.xlsx`; khi deploy lên Vercel phải đưa cả thư mục `templates` lên.
- Không nhúng mẫu chứa thông tin nhạy cảm hoặc đơn khách thật vào thư mục public.
- Source chưa được kiểm thử trực tiếp việc xuất file trên trình duyệt của bạn.
