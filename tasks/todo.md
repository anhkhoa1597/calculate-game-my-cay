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

## R2: Người dùng được tự nhớ cấu hình khi chơi

**Mô tả:** Làm gọn đường cập nhật → lưu → reload và đường tìm giá; bỏ JSON/phục hồi, giữ reset có xác nhận gọn.

**Acceptance:**
- [x] Chỉnh thông số/menu hoặc Tìm giá/Dùng giá tự nhớ cấu hình hợp lệ với key/schema cũ; input sai không ghi đè bản hợp lệ.
- [x] Không còn nút/handler import/export/phục hồi JSON; bản lưu hỏng dùng LV1 và cho ghi cấu hình mới, không khóa tác vụ.
- [x] Storage lỗi chỉ báo ngắn và không ngăn tính; hủy reset giữ nguyên cấu hình.

**Verify:** `node check-ui.cjs`; `node --check app.js`; `git diff --check`; một lần cập nhật → reload và xác nhận đường tính không phụ thuộc save thành công. Chỉnh test phục hồi cũ theo hành vi mới, không dựng hệ thống test storage mới.
**Dependencies:** R1 đã xong.
**Files:** `app.js`, `index.html`, `check-ui.cjs`.
**Scope:** M, 3 files. **Trace:** M04, M05.

## R3: Người dùng tìm và dùng giá thuận tiện trên mobile

**Mô tả:** Hoàn tất các chỉnh sửa UI đang dở, sửa vướng mắc thực tế trong một luồng mobile; giữ desktop đơn giản.

**Acceptance:**
- [x] Nhập quán/menu dễ chạm, đủ đọc; menu/kết quả không kéo ngang và thanh dưới không che thao tác nhập.
- [x] Tìm/lọc không mất giá/lựa chọn; Tìm giá hoạt động sau nhập/tìm tên món; kết quả phân biệt lời/lỗ, chênh lệch, sức phục vụ/mất khách/sao đúng.
- [x] Luồng tìm → xem → dùng giá → reload chạy được trên mobile; desktop mở và dùng cùng chức năng, không cần layout riêng.

**Verify:** `node check-ui.cjs`; `node --check app.js`; smoke khoảng 390px, liếc 320px và mở desktop một lần. Tái dùng bằng chứng cũ cho phần không đổi; không chạy ma trận UI rộng.
**Dependencies:** R2.
**Files:** `app.js`, `index.html`, `style.css`.
**Scope:** M, 3 files. **Trace:** M01, M02, M03, M07.

## Checkpoint: Sau R2–R3

- [x] Tự nhớ/reload và luồng mobile chính hoạt động; không còn luồng JSON/phục hồi.
- [x] Checks liên quan qua; kết quả vẫn từ engine hiện có.
- [x] Ghi ngắn kết quả thực đã kiểm tra, tiếp tục R4 theo phạm vi đã duyệt.

## R4: Bản cập nhật được kiểm tra và đưa lên repo

**Mô tả:** Kiểm tra tính toán và phần kết nối còn lại, cập nhật hướng dẫn, commit/push theo quyền đã có.

**Acceptance:**
- [x] Engine/Worker/logic UI/cú pháp liên quan qua; giữ nguyên engine/data/seed/sample count và smoke luồng mobile sau thay đổi cuối.
- [x] README ghi đúng tự nhớ phụ, không JSON, Worker/fallback và giới hạn mô hình; không nhận đã test thiết bị thật nếu chưa làm.
- [x] Commit/push hoàn tất, working tree được báo đúng; không suy ra Pages đã triển khai chỉ từ việc push.

**Verify:** `node check.cjs`; `node check-worker.cjs`; `node check-ui.cjs`; `node --check app.js`; `node --check engine.js`; `node --check worker.js`; `git diff --check`; `git status --short`; đối chiếu commit local/remote sau push. Không cần build.
**Dependencies:** R2, R3.
**Files:** `README.md`, `tasks/todo.md`, `tasks/verification.md` nếu cần ghi kết quả ngắn.
**Scope:** M, tối đa 3 files. **Trace:** M06, M08 và luồng chính M01–M07.

## Checkpoint: Hoàn tất

- [x] M01–M08 được đối chiếu với kết quả kiểm tra thực.
- [x] Tài liệu và repo đã cập nhật; báo rõ trạng thái Pages nếu có kiểm tra.

Không còn yêu cầu nghiệm thu ma trận UI cũ, Lighthouse, điện thoại thật, mọi theme/zoom hoặc xuất/phục hồi bản lưu. Không xóa test tính toán để giảm khối lượng UI.
