# Tasks: Sổ giá Tiệm Mì Cay

Nguồn: `SPEC.md` đã duyệt 02/10/2026. Kế hoạch tương ứng: `tasks/plan.md`.
Các task mới chưa bắt đầu; checkpoint và bước nghiệm thu không được tick chỉ vì code đã viết.

## Lịch sử bản đầu

- [x] Engine mô phỏng và kiểm tra.
- [x] Giao diện và lưu localStorage.
- [x] Kiểm chứng tính toán LV1 / full quán, đóng gói.
- [ ] Kiểm tra trình duyệt trực tiếp còn thiếu từ bản đầu: giữ mở, được bao phủ trong T9.

## T1: Người dùng tìm giá khi trang vẫn phản hồi

**Mô tả:** Nối Worker vào đường submit hiện có, cùng progress/result/error và snapshot. Giữ khả năng tính khi mở file trực tiếp.

**Acceptance:**
- [ ] HTTP(S) chạy tối ưu ngoài main thread; điều hướng/cuộn vẫn hoạt động, control sửa cấu hình khóa trong lượt.
- [ ] Kết quả khớp engine trực tiếp; request id ngăn response cũ, apply giá cũ bị vô hiệu khi đang tính.
- [ ] Worker lỗi trả UI về trạng thái dùng được; file:// fallback rõ, không tự chạy lại lượt lỗi âm thầm.

**Verify:** `node check.cjs`; `node check-worker.cjs`; `node --check worker.js`; `node --check app.js`; browser thử LV1/full quán và lỗi Worker.
**Dependencies:** None.
**Files:** `worker.js`, `app.js`, `check-worker.cjs`.
**Scope:** M, 3 files. **Trace:** AC09, AC12.

## T2: Người dùng giữ được cấu hình qua reload và lỗi lưu

**Mô tả:** Bảo vệ cấu hình hợp lệ gần nhất, giữ raw bản hỏng khi restore thất bại, phản ánh đúng save status và tránh reset nhầm.

**Acceptance:**
- [ ] Cấu hình/giá từ bản cũ reload nguyên vẹn, key/schema không đổi; input sai không overwrite bản hợp lệ.
- [ ] Lưu bị chặn báo Chưa lưu, không bị status khác ghi thành Đã lưu; bản hỏng có thể xuất để phục hồi.
- [ ] Về LV1 có xác nhận trong sản phẩm hoặc hoàn tác; từ chối reset không thay cấu hình.

**Verify:** `node check.cjs`; `node --check app.js`; browser reload, storage bị chặn, JSON hỏng và reset/hủy reset.
**Dependencies:** None, triển khai sau T1 để tránh sửa chung file.
**Files:** `app.js`, `index.html`.
**Scope:** S, 2 files. **Trace:** AC01, AC10.

## T3: Người dùng sửa lỗi nhập ngay tại control

**Mô tả:** Thêm lỗi inline và error summary có focus/liên kết; phân biệt rỗng với 0, thông báo thay đổi do giảm cấp và giải thích số đánh giá.

**Acceptance:**
- [ ] Giá/range/step/số nguyên/rỗng sai có aria-invalid và lỗi liên kết; submit đưa focus tới summary, không giật focus khi đang gõ.
- [ ] Không có nước lèo/prerequisite sai chỉ đúng nhóm; giảm cấp nêu rõ mục bị bỏ, tăng cấp không tự mua/chọn.
- [ ] Không có review = 4 sao; xấp xỉ 30 review khi nhập sao được giải thích, validation engine vẫn chạy trước lưu/tính.

**Verify:** `node check.cjs`; `node --check app.js`; browser Tab/error-summary và các input rỗng/0/giá 500đ/giá sai bước/giảm cấp.
**Dependencies:** T2.
**Files:** `app.js`, `index.html`, `style.css`.
**Scope:** M, 3 files. **Trace:** AC02, AC05.

## Checkpoint A: Nhập, lưu và tính

- [ ] T1-T3 đạt acceptance; checks liên quan qua.
- [ ] LV1 nhập → lưu → reload → tìm giá → lỗi → sửa → tính lại hoạt động.
- [ ] Bản cấu hình cũ không mất dữ liệu; kết quả cùng đầu vào khớp engine.
- [ ] Ghi evidence và đưa checkpoint cho người dùng review; đánh dấu cụ thể phần chưa kiểm tra browser.

## T4: Người dùng tìm/chọn món mà không mất giá

**Mô tả:** Lọc Có thể mở theo cấp / Đang bán / Tất cả, tìm không dấu và đếm món theo nhóm trên nguồn state đầy đủ.

**Acceptance:**
- [ ] Mặc định lọc theo cấp; search không dấu/hoa thường, giữ thứ tự catalog và selection/giá khi đổi filter.
- [ ] Tất cả hiển thị món khóa với Cần LVx; Chọn tất cả theo cấp không chọn staff/upgrades và giải thích phải đã mua.
- [ ] Giá nền/topping và vốn trình bày đúng; Chưa tính/Cần tính lại thay cho dấu trang trí; lọc presentation không làm kết quả hết hiệu lực.

**Verify:** `node check.cjs`; `node --check app.js`; browser nhập giá, lọc 3 chế độ, tìm “pho mai”, xóa search, tính và kiểm tra cấu hình vẫn đầy đủ.
**Dependencies:** T3.
**Files:** `app.js`, `index.html`, `style.css`.
**Scope:** M, 3 files. **Trace:** AC02, AC06.

## T5: Người dùng biết nên đổi hay giữ giá

**Mô tả:** Đưa quyết định và thông số quan trọng lên đầu kết quả, nhóm chi tiết và gắn apply với snapshot còn hiệu lực.

**Acceptance:**
- [ ] Có nội dung riêng cho delta tăng/âm/chưa rõ và giá cũ ngoài ràng buộc an toàn; không khẳng định tăng lời khi bằng chứng không đủ.
- [ ] Hiện lợi nhuận/chênh lệch, tô, mất vì đầy, timeout/chưa xong và sao; chi tiết thu chi/khách/phương án/tiêu thụ có thể mở.
- [ ] Dùng giá chỉ lưu vào công cụ; sửa cấu hình làm stale, apply không dùng kết quả cũ; giới hạn mô hình vẫn rõ.

**Verify:** `node check.cjs`; `node --check app.js`; kiểm tra branch quyết định bằng kết quả hữu hạn xác định; browser các trường hợp lợi nhuận âm/nhiễu/quá tải/sao giảm/ràng buộc an toàn.
**Dependencies:** T1, T3.
**Files:** `app.js`, `index.html`, `style.css`, `check.cjs` nếu bổ sung một check logic quyết định cần thiết.
**Scope:** M, tối đa 4 files. **Trace:** AC07, AC08.

## T6: Người dùng đọc và nhập thuận tiện ở light/dark

**Mô tả:** Chuẩn hóa token/CSS và bố cục theo spec; thu gọn giới thiệu, thống nhất typography, menu mobile và nhóm form.

**Acceptance:**
- [ ] 320/375/390px menu/comparison không kéo ngang; desktop từ 1024px hai vùng đủ rộng; không đổi field names, anchors hoặc nhãn điều hướng.
- [ ] Body/input 16px, helper ≥12px, touch target ≥44px; radius/spacing và số tiền nhất quán.
- [ ] Light/dark theo hệ thống, text contrast ≥4,5:1 và trạng thái có chữ; reduced motion hoạt động, không thêm ảnh/animation library.

**Verify:** `node --check app.js`; `git diff --check`; browser ma trận 320/375/390/768/1024/1440, đo contrast và kiểm tra light/dark/reduced-motion.
**Dependencies:** T4, T5.
**Files:** `style.css`, `index.html`, `app.js`.
**Scope:** M, 3 files. **Trace:** AC03, AC04, AC11.

## Checkpoint B: Luồng chính trên mobile

- [ ] T4-T6 đạt acceptance; checks liên quan qua.
- [ ] Cấu hình LV1 và LV9/full menu nhập → lọc → tính → xem → dùng giá → reload hoạt động.
- [ ] Giá trị/selection không mất khi lọc; copy kết quả trung thực trong các tình huống bất lợi.
- [ ] Ghi evidence và đưa checkpoint cho người dùng review; chưa có browser thì không tick nghiệm thu UI.

## T7: Người dùng thao tác khi bàn phím mở và zoom

**Mô tả:** Hoàn thiện thanh dưới, đo inset thật và quản lý focus/scroll theo tương tác thay vì tự cuộn mọi lần tính xong.

**Acceptance:**
- [ ] Safe area và chiều cao status được bù theo thanh thực; focus/nội dung không bị che ở portrait/landscape và zoom 200%.
- [ ] Input focus và lỗi nhìn thấy khi bàn phím mở; fallback thu gọn/flow làm việc khi VisualViewport không có.
- [ ] Kết quả có heading focusable; không lấy focus của người đang nhập/chuyển đọc vùng khác; Tab/Shift+Tab đi đúng thứ tự.

**Verify:** `node --check app.js`; browser desktop keyboard/zoom, Safari iOS và Chrome Android với bàn phím số, đổi hướng và safe area.
**Dependencies:** T6.
**Files:** `app.js`, `style.css`, `index.html`.
**Scope:** M, 3 files. **Trace:** AC04, AC11.

## T8: Người dùng tra cứu đủ data khi cần

**Mô tả:** Dựng database lần đầu mở disclosure; giới hạn cuộn trong vùng bảng có nhãn và hint.

**Acceptance:**
- [ ] Chưa mở tra cứu không dựng hàng data; mở lần đầu có đủ 21 bảng, mở lại không nhân đôi.
- [ ] Vùng bảng có nhãn, keyboard/cuộn sử dụng được; không gây overflow ngang toàn trang.
- [ ] Lỗi render báo trong vùng tra cứu, không phá form hoặc kết quả; không đổi catalog/engine.

**Verify:** `node --check app.js`; browser kiểm tra DOM trước/sau mở, số bảng, mở lại và cuộn ở 320px.
**Dependencies:** T6.
**Files:** `app.js`, `index.html`, `style.css`.
**Scope:** M, 3 files. **Trace:** AC03, AC12.

## T9: Nghiệm thu và ghi bằng chứng

**Mô tả:** Đối chiếu mọi AC; kiểm tra cả tồn đọng browser bản đầu, ghi điều kiện đo và cập nhật hướng dẫn.

**Acceptance:**
- [ ] AC01-AC12 có evidence hoặc ghi rõ chưa kiểm chứng; không đánh dấu hoàn tất UI chỉ bằng Node checks.
- [ ] Node/syntax/Worker checks qua; browser light/dark, 6 widths, keyboard, zoom, mobile keyboards; Lighthouse HTTP(S) có điều kiện đo và giá trị thực.
- [ ] README đúng hành vi mới/fallback/giới hạn; commit/push và trạng thái Pages được phân biệt, không báo đã deploy nếu chưa xác nhận.

**Verify:** `node check.cjs`; `node check-worker.cjs`; `node --check app.js`; `node --check engine.js`; `node --check worker.js`; `git diff --check`; browser/Lighthouse theo ma trận trong spec.
**Dependencies:** T1-T8.
**Files:** `README.md`, `SPEC.md`, `tasks/todo.md`, `tasks/verification.md` (evidence).
**Scope:** M, tối đa 4 files. **Trace:** AC01-AC12; tồn đọng browser bản đầu.

## Checkpoint C: Sẵn sàng nghiệm thu

- [ ] T7-T9 đạt acceptance; đủ bằng chứng kiểm tra liên quan.
- [ ] Không đổi thuật toán/catalog/sample count; cấu hình cũ giữ được.
- [ ] Người dùng review kết quả và các giới hạn/chỉ tiêu chưa đạt.
- [ ] Chỉ đóng tồn đọng browser bản đầu sau khi kiểm tra thực.
- [ ] Commit/push hoàn tất theo phạm vi được phép; không suy ra GitHub Pages đã deploy từ việc push thành công.
