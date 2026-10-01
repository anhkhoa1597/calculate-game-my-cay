# Plan: ưu tiên mobile, giảm phần lưu và kiểm thử UI

Cập nhật 02/10/2026 theo yêu cầu mới; đọc `SPEC.md` thay cho các tiêu chí UI/storage/test cũ. Task list: `tasks/todo.md`.

## Trạng thái thực tế

T1–T8 của kế hoạch trước đã có code qua các commit: Worker, lưu/validation, lọc menu, quyết định kết quả, responsive/dark, thanh dưới/focus và data lazy. Đã kiểm tra engine/Worker và một số luồng trong trình duyệt. Đây không phải tuyên bố toàn bộ acceptance cũ đã qua.

Hiện còn sửa code chưa commit từ đợt trước. Giữ chúng để xử lý trong các task còn lại; lần cập nhật spec này không sửa code sản phẩm.

## Hướng xử lý phần còn lại

1. R1: cập nhật spec/plan/todo theo ưu tiên mới.
2. R2: làm gọn lưu tự động: bỏ import/export/phục hồi JSON, không khóa lưu khi bản cũ hỏng; dùng LV1 và lưu cấu hình hợp lệ mới. Lưu lỗi không chặn tính. Giữ key/schema hợp lệ cũ.
3. R3: rà một lượt luồng mobile và sửa vướng mắc thực tế. Giữ các phần hiện có hữu ích; không thiết kế lại desktop hoặc mở rộng design system.
4. R4: chạy checks tính toán/Worker/logic UI liên quan; smoke mobile khoảng 390px, liếc 320px và mở desktop một lần. Cập nhật README, commit/push theo quyền đã có.

Làm tuần tự. Không thêm subagent, dependency, framework test hoặc bước duyệt lặp lại cho phạm vi người dùng đã chỉ rõ.

## Kiến trúc giữ nguyên

HTML/CSS/JavaScript tĩnh; state đầy đủ độc lập với bộ lọc; Worker dùng snapshot và request id; engine/data không đổi. localStorage best-effort sau cập nhật hợp lệ và trước tìm giá, thất bại vẫn tiếp tục tác vụ.

## Kiểm chứng

Lệnh ở `SPEC.md`. Tập trung engine, công suất khách và nội dung đề xuất; UI chỉ smoke luồng chính. Kết quả test trước đây không cần chạy lại nếu code liên quan không đổi. Không còn gate Lighthouse, ma trận 6 widths, thiết bị thật, zoom/theme sâu hoặc phục hồi JSON.

Push thành công không đồng nghĩa GitHub Pages đã triển khai; không báo đã deploy nếu chưa có bằng chứng.
