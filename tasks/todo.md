# Tasks: phạm vi mobile gọn

Cập nhật 02/10/2026 theo `SPEC.md` mới. Checklist cũ T1–T9 được thay bằng phần việc còn lại; code đã làm không bị coi là chưa làm lại, cũng không tự coi đã nghiệm thu.

## Lịch sử có sẵn

- Engine/data gốc, trang tĩnh và remote GitHub đã có.
- T1–T8 đã triển khai qua các commit: Worker; validation/lưu; lọc/tìm không dấu; kết quả; responsive/dark; thanh dưới/focus; tra cứu lazy.
- Đã kiểm tra Node logic, Worker LV1/LV9 và browser nhập/lọc/tính/áp dụng/reload; từng phát hiện và sửa lỗi click nút tính khi focus thay đổi.
- Một số điều chỉnh app/index/style cuối đợt còn chưa commit. Không gán trạng thái pass cho các kiểm tra chưa thực hiện.

## R1: Spec lại theo ưu tiên mới

- [x] Mobile là bản chính; desktop chỉ cần dùng được.
- [x] Không import/export/phục hồi JSON; auto-save là phần phụ, không cản tính.
- [x] Giữ kiểm tra thuật toán; giảm UI test về smoke luồng chính.
- Verify: đối chiếu yêu cầu mới với `SPEC.md`, `tasks/plan.md` và todo.
- Files: `SPEC.md`, `tasks/plan.md`, `tasks/todo.md`.

## R2: Lưu tự động đơn giản

- [ ] Bỏ nút/handler JSON và UI phục hồi; cấu hình hỏng dùng LV1, không khóa ghi cấu hình mới.
- [ ] Tự nhớ cấu hình hợp lệ khi cập nhật thông số/chọn món/chỉnh giá và khi Tìm giá/Dùng giá.
- [ ] Input sai không ghi đè bản hợp lệ; lỗi storage chỉ báo ngắn, vẫn tính được.
- [ ] Giữ key/schema bản cũ còn hợp lệ; reset có xác nhận gọn.
- Verify: Node checks logic lưu liên quan, một lần cập nhật → reload; xác nhận lỗi lưu không chặn tính.
- Files: `app.js`, `index.html`, `check-ui.cjs` nếu hành vi test cần cập nhật.
- Trace: M04, M05.

## R3: Hoàn thiện luồng mobile

- [ ] Nhập quán/menu dễ chạm, chữ đủ đọc; menu/kết quả không kéo ngang.
- [ ] Lọc không làm mất giá/lựa chọn; Tìm giá hoạt động khi vừa nhập/tìm tên món.
- [ ] Kết quả có lời/lỗ, chênh lệch, sức phục vụ/mất khách/sao và giải thích đúng.
- [ ] Thanh dưới không che input; desktop mở được và dùng được, không tối ưu riêng.
- Verify: một smoke mobile khoảng 390px, liếc 320px và mở desktop một lần; sửa lỗi thực phát hiện.
- Files: `app.js`, `index.html`, `style.css`.
- Trace: M01, M02, M03, M07.

## R4: Kiểm tra logic và hoàn tất

- [ ] Engine/Worker/logic UI/cú pháp liên quan qua; engine/data/sample count giữ nguyên.
- [ ] Smoke luồng nhập → chọn/lọc → tính → xem → dùng giá → reload qua.
- [ ] README phản ánh lưu phụ, không JSON, Worker/fallback và giới hạn mô hình.
- [ ] Commit/push hoàn tất; phân biệt trạng thái repo với triển khai Pages.
- Verify: lệnh `SPEC.md`; `git diff --check`, `git status --short` và trạng thái remote sau push.
- Files: `README.md`, `tasks/todo.md`, `tasks/verification.md` nếu cần ghi kết quả ngắn.
- Trace: M06, M08 và luồng chính M01–M07.

Không còn yêu cầu nghiệm thu ma trận UI cũ, Lighthouse, điện thoại thật, mọi theme/zoom hoặc xuất/phục hồi bản lưu. Không xóa test tính toán để giảm khối lượng UI.
