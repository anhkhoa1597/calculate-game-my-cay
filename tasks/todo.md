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

## R5: Game 2.3.8 và kiểm tra core

- [x] Đối chiếu bundle mới, catalog và các công thức ảnh hưởng tới tối ưu.
- [x] Cập nhật chương, kênh bán, sức chứa, thuê, thời tiết, cấu hình cũ và data tra cứu.
- [x] Chạy kiểm tra core 5 chương, 1.000 ngày LV1 giá 30k, Worker và lưu chương; smoke mobile một lượt.
- [x] Ghi kết quả, commit và push.

Triển khai tuần tự toàn bộ trước khi chạy kiểm tra theo yêu cầu người dùng. Giữ ngân sách seed/tìm giá; không ép mô phỏng thành 24 khách, không mở rộng test UI.

## R6: Rà core, giải thích dự đoán game và thêm khoảng tô

- [x] Tái lập theo giả định rõ ràng trường hợp ngày 2: 37 dự đoán và 28,8 tô mô phỏng.
- [x] Viết RED trước GREEN cho forecast, min/max, no reviews và event; sửa core/UI; giữ tối ưu lợi nhuận.
- [x] Checks đầy đủ core/Worker/UI, đối chiếu source 600 cấu hình và smoke mobile mới qua.
- [x] Ghi kết quả và giới hạn mô hình.
- [x] Commit/push bản cập nhật theo quyền đã có.


## Gia truyền — S1–S6 (đã duyệt)

Spec đã duyệt ngày 02/10/2026. Đã triển khai tuần tự và kiểm thử sau khi hoàn tất theo yêu cầu. Bằng chứng trong `tasks/verification.md`.

### S1: Đối chiếu source 2.3.9

- [x] Đối chiếu cả 9 nước lèo và catalog liên quan, các nhánh khách/kênh/giá/chờ/rating/tip với mô hình hiện tại; ghi sai khác và giới hạn.
- [x] Xác nhận day >=3, khóa nồi, record đúng ngày, +1 sao/nhóm, online không tip và thứ tự thưởng; không hiểu nhầm khóa nút 300ms thành tiền/XP.
- [x] Chỉ đổi data có bằng chứng; nếu phát sinh phạm vi mới đáng kể cập nhật spec trước.

**Verify:** đọc source gốc và đối chiếu audit với engine/data; `git diff --check`; chạy `node check.cjs` nếu sửa data.
**Dependencies:** spec đã duyệt.
**Files:** `audits/secret-broth-2.3.9.md`, `game-data.js` nếu cần, `SPEC.md` nếu cần.
**Scope:** nhỏ, tối đa 3 file.

### S2: Người chơi khai báo gia truyền hôm nay

- [x] Thêm/validate record secret; cấu hình cũ mặc định none; chặn nồi/mã/ngày không hợp lệ, ngày 1–2 không có buff.
- [x] Nhóm input mobile thu gọn khai báo 4 trạng thái và nồi; đổi ngày/level/menu hạ record không hợp lệ và đánh dấu kết quả cũ.
- [x] Save/snapshot giữ đúng trạng thái thực; lỗi storage không chặn tính, không tự chuyển active khi xem gợi ý.

**Verify:** cases trạng thái trong `node --test check-secret.cjs`; `node --check engine.js`; `node --check app.js`; UI smoke để cuối S6.
**Dependencies:** S1.
**Files:** `engine.js`, `app.js`, `index.html`, `check-secret.cjs`, `check-ui.cjs`.
**Scope:** vừa, 5 file.

### S3: Mô phỏng sao và tip gia truyền

- [x] Nhóm hoàn tất có match nhận đúng +1 sao, clamp 5; online nhận sao; bỏ về/giao dở không nhận thưởng hoàn tất.
- [x] Tip chỉ tại quán 2k/tô match; hũ tip không nhân phần này, payday nhân đôi, rating mới ảnh hưởng tô sứ/mèo; reviewer dùng rating cuối.
- [x] Ghi tô match đã giao/nhóm thực cộng sao/tip trực tiếp; không đổi vốn/giá/topping/tốc độ; sao mới ảnh hưởng traffic trong ngày, không sửa forecast đầu ngày.

**Verify:** G02–G04 cho cả 9 nồi, nhóm 1/2/3 và tiền xác định; `node --test check-secret.cjs`; `node check.cjs`; `node --test check-forecast.cjs`.
**Dependencies:** S2.
**Files:** `engine.js`, `check-secret.cjs`, `check.cjs` nếu cần.
**Scope:** vừa, tối đa 3 file.

### Checkpoint core sau S2–S3

- [x] Trạng thái cũ/none giữ kết quả seed cũ; tiền/sao/match khớp nguồn; ledger không sai; ghi bằng chứng checks cuối.

### S4: So sánh nồi gia truyền qua Worker

- [x] So none và các nồi hợp lệ giả định active bằng cùng giá/256 seed; trả profit delta, khoảng bất định, mean/min/max tô, sao và tip; ranking theo lợi nhuận và báo chưa rõ khi nhiễu.
- [x] Áp hạn chế chưa thử/khóa/hết lượt/active/ngày <3; không mutate config thật, không chạy full optimize riêng từng nồi; optimize active tính buff thật.
- [x] Worker/direct cho kết quả giống nhau, progress/request id/validation vẫn đúng.

**Verify:** comparator tests trong `node --test check-secret.cjs`; `node check-worker.cjs`; kiểm tra cấu hình sau mô phỏng không bị đổi và số seed/kịch bản đúng.
**Dependencies:** S3.
**Files:** `engine.js`, `worker.js` nếu cần, `check-secret.cjs`, `check-worker.cjs`.
**Scope:** vừa, tối đa 4 file.

### S5: Người chơi đọc được nồi nên chọn trên mobile

- [x] Hiện lợi ích gia truyền và so sánh cùng giá, phân biệt buff thật/giả định; không kết luận nồi đắt nhất luôn tốt hơn hoặc hứa tối ưu toàn cục.
- [x] Một nồi chỉ hiện so none; đã khóa/active/hết lượt không khuyên đổi; nhắc tìm giá lại sau khi khai báo làm đúng.
- [x] Giữ mean/min–max/forecast khác nhau, thao tác mobile rõ và save best effort; không mở rộng desktop hoặc JSON.

**Verify:** `node check-ui.cjs`; `node --check app.js`; `git diff --check`; smoke trình duyệt thực ở S6.
**Dependencies:** S4.
**Files:** `app.js`, `index.html`, `style.css`, `check-ui.cjs`.
**Scope:** vừa, 4 file.

### Checkpoint luồng tính sau S4–S5

- [x] Worker trả dữ liệu comparator đầy đủ; UI không ghi kịch bản giả định thành trạng thái thật; input thay đổi làm kết quả cũ được đánh dấu.

### S6: Hồi quy core và hoàn tất

- [x] Bổ sung/chạy ma trận G01–G08: từng nồi và menu trộn, sao/topping/menu màu/giá/sức bếp/kênh; kiểm tra counts, tiền, min–max, ledger và trạng thái.
- [x] Chạy toàn bộ checks/cú pháp/diff; smoke mobile một lần nhập→tính→đọc→reload→đổi ngày; sửa lỗi nếu phát hiện, không mở rộng ma trận UI.
- [x] Ghi kết quả thật/giới hạn; chỉ bỏ loại trừ gia truyền và đổi provenance core khi có bằng chứng; commit/push theo quyền đã có.

**Verify:** toàn bộ lệnh ở phần gia truyền SPEC; Node tests và smoke thực; `git diff --check`; kiểm tra working tree/commit/push.
**Dependencies:** S5.
**Files:** `check-secret.cjs`, `check-worker.cjs`, `README.md`, `tasks/verification.md`, `tasks/todo.md`. Nếu cần sửa sản phẩm, quay về task liên quan và chạy lại checks bị ảnh hưởng.
**Scope:** vừa, 5 file.
