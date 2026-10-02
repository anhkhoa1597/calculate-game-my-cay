# Plan: ưu tiên mobile, giảm phần lưu và kiểm thử UI

Cập nhật 02/10/2026 theo yêu cầu mới; đọc `SPEC.md` thay cho các tiêu chí UI/storage/test cũ. Spec đã được người dùng duyệt. Task list duy nhất: `tasks/todo.md`. Lượt này chốt kế hoạch, không sửa code sản phẩm.

## Trạng thái thực tế

T1–T8 của kế hoạch trước đã có code qua các commit: Worker, lưu/validation, lọc menu, quyết định kết quả, responsive/dark, thanh dưới/focus và data lazy. Đã kiểm tra engine/Worker và một số luồng trong trình duyệt. Đây không phải tuyên bố toàn bộ acceptance cũ đã qua.

Hiện còn sửa code chưa commit từ đợt trước. Giữ chúng để xử lý trong các task còn lại; lần cập nhật spec này không sửa code sản phẩm.

## Hướng xử lý phần còn lại

1. R1: cập nhật spec/plan/todo theo ưu tiên mới.
2. R2: làm gọn lưu tự động: bỏ import/export/phục hồi JSON, không khóa lưu khi bản cũ hỏng; dùng LV1 và lưu cấu hình hợp lệ mới. Lưu lỗi không chặn tính. Giữ key/schema hợp lệ cũ.
3. R3: rà một lượt luồng mobile và sửa vướng mắc thực tế. Giữ các phần hiện có hữu ích; không thiết kế lại desktop hoặc mở rộng design system.
4. R4: chạy checks tính toán/Worker/logic UI liên quan; smoke mobile khoảng 390px, liếc 320px và mở desktop một lần. Cập nhật README, commit/push theo quyền đã có.

Làm tuần tự. Không thêm subagent, dependency, framework test hoặc bước duyệt lặp lại cho phạm vi người dùng đã chỉ rõ.

## Dependencies và checkpoint

```text
R1 Spec đã duyệt → R2 Tự nhớ đơn giản → R3 Luồng mobile
                                      ↓
                            Checkpoint: luồng chính
                                      ↓
                            R4 Kiểm tra và hoàn tất
```

R2 làm trước vì đang có nhánh chặn ghi khi cấu hình hỏng và các nút JSON trong app; bỏ chúng phải đồng thời sửa handlers và checks. R3 sử dụng trạng thái lưu mới để kiểm tra trọn luồng. R4 chạy kiểm tra cuối sau khi UI ổn định.

Checkpoint sau R2–R3: cấu hình được tự nhớ, không có luồng JSON, mobile tìm/lọc/tính/dùng giá hoạt động. Checkpoint cuối: kiểm tra logic qua, tài liệu đúng hành vi và repo được push. Ghi kết quả ngắn, không thêm vòng xin duyệt hoặc mở lại ma trận UI cũ.

## Kiến trúc giữ nguyên

HTML/CSS/JavaScript tĩnh; state đầy đủ độc lập với bộ lọc; Worker dùng snapshot và request id; engine/data không đổi. localStorage best-effort sau cập nhật hợp lệ và trước tìm giá, thất bại vẫn tiếp tục tác vụ.

## Kiểm chứng

Lệnh ở `SPEC.md`. Tập trung engine, công suất khách và nội dung đề xuất; UI chỉ smoke luồng chính. Kết quả test trước đây không cần chạy lại nếu code liên quan không đổi. Không còn gate Lighthouse, ma trận 6 widths, thiết bị thật, zoom/theme sâu hoặc phục hồi JSON.

Push thành công không đồng nghĩa GitHub Pages đã triển khai; không báo đã deploy nếu chưa có bằng chứng.

## Rủi ro và xử lý

| Rủi ro | Cách xử lý |
|---|---|
| Bỏ JSON nhưng còn handler tham chiếu nút đã xóa | Sửa markup/handlers cùng R2; kiểm tra cú pháp và smoke |
| Save lỗi làm gián đoạn tối ưu | Save trả thành công/thất bại; submit vẫn chạy với cấu hình hợp lệ |
| Bộ lọc đọc thiếu món đang ẩn | Giữ state đầy đủ; lọc chỉ đổi cách hiển thị |
| Code chưa commit bị mất trong lúc làm gọn | Rà diff hiện có, giữ chỉnh sửa hữu ích và commit theo từng task |
| Thay đổi UI vô tình đổi kết quả | Không sửa engine/data; giữ checks Worker/seed/công suất |

Không có câu hỏi sản phẩm đang chặn. Desktop, lưu trữ và test UI không được mở rộng ngoài spec đã duyệt.

## R5: source 2.3.8 theo yêu cầu cập nhật

Phạm vi mới cho phép sửa engine/data: đối chiếu source → cập nhật chương/kênh bán/thu hút/fixed → UI và migrate → chạy core/Worker/storage rồi smoke mobile → ghi kết quả và push. Thực hiện tuần tự, triển khai hết trước khi test. Seed và ngân sách tìm giá giữ nguyên; không mô phỏng nhiệm vụ chuyển chương hoặc tô hướng dẫn, không hardcode 24 khách. Kết quả ở tasks/verification.md.


## Gia truyền — kế hoạch bổ sung 02/10/2026

Spec gia truyền được người dùng duyệt bằng “chốt”. Phần này bổ sung công việc mới, giữ nguyên lịch sử R1–R6 đã hoàn tất. **Người dùng đã duyệt kế hoạch/task và yêu cầu triển khai toàn bộ rồi kiểm thử kỹ ngày 02/10/2026.** Dùng `SPEC.md:195` và `audits/secret-broth-2.3.9.md` làm căn cứ.

### Quyết định kỹ thuật

- Giữ một engine duy nhất và kênh optimize/Worker hiện có; không thêm dependency hoặc bộ giải minigame.
- `secret` là record trạng thái gắn ngày; dữ liệu cũ không có record được hiểu là none. Core chặn mã/nồi không hợp lệ; UI hạ trạng thái khi đổi ngày/menu/level để khớp game. Không thay cấu hình thật khi chạy giả định.
- Hoàn tất nhóm mới cộng sao/tip. Tách một helper tính rating/tip nếu cần test xác định; helper phải được simulate dùng trực tiếp, không viết logic giả riêng trong tests. Không tiêu thụ random mới khi secret none để giữ kết quả cũ theo seed.
- Mỗi lượt tính vẫn tối ưu giá với trạng thái thật. Chưa thử: sau tối ưu, so none với từng nồi giả định thành công ở cùng bảng giá, 256 seed như nhau; tối đa 10 kịch bản. Đã khóa chỉ so nồi đã khóa; active không khuyên đổi nồi; hết lượt/ngày <3 không khuyên làm gia truyền.
- Tách chênh lệch lợi nhuận trung bình, tip trực tiếp, nhóm nhận sao và số tô đúng nồi. Khoảng bất định dùng chênh lệch từng cặp seed; min–max tô là mẫu quan sát, không phải bảo đảm. Không kết luận hơn nhau khi khoảng bất định chứa 0.
- UI thu gọn ưu tiên mobile; bảng nhiều nồi dùng cách trình bày đọc được trên màn hình nhỏ. Lưu best effort; không import/export JSON, không mở rộng desktop hoặc ma trận UI.

### Thứ tự và các điểm kiểm chứng

```text
S1 Đối chiếu source 2.3.9
  → S2 Khai báo trạng thái hợp lệ
  → S3 Tính sao/tip khi hoàn tất nhóm
  → checkpoint core
  → S4 So sánh nồi qua engine/Worker
  → S5 Đọc đề xuất trên mobile
  → checkpoint luồng tính
  → S6 Hồi quy đầy đủ, tài liệu và hoàn tất
```

S2 có đường nhập/lưu trạng thái; S3 làm hiệu ứng có ý nghĩa trong mô phỏng; S4 trả dữ liệu so sánh; S5 hiển thị dữ liệu ấy. Làm tuần tự. Theo chỉ đạo mới nhất của người dùng, triển khai toàn bộ rồi chạy tests; không tuyên bố có bước RED trước code. Checkpoint nội bộ ghi bằng chứng, không thêm gate xin duyệt từng task.

Danh sách việc chi tiết duy nhất nằm ở mục S1–S6 trong `tasks/todo.md`. Mỗi task tối đa khoảng 5 file; chỉ thay catalog nếu source chứng minh dữ liệu đã đổi. Không đổi provenance toàn core chỉ dựa trên audit gia truyền.

### Rủi ro và cách xử lý

| Rủi ro | Xử lý |
|---|---|
| Bundle 2.3.9 thay đổi thêm ngoài gia truyền | S1 đối chiếu catalog, khách/kênh/giá/chờ/rating/tip; ghi rõ phần chưa mô phỏng, cập nhật spec nếu phát hiện mở rộng đáng kể |
| Sai thứ tự tip hoặc thưởng nhóm giao dở | Test xác định tiền/sao trước; tip gia truyền sau hũ tip, trước mèo/payday; chỉ nhóm hoàn tất |
| Buff sao thay đổi lượng khách và RNG | Test feedback trong ngày; không nâng sao đầu ngày, không thêm hệ số khách; giữ seed none cũ |
| Khác biệt hai nồi nhỏ hơn nhiễu | So cặp cùng seed; báo chưa rõ; không quảng cáo tối ưu toàn cục |
| So 9 nồi khiến mobile chậm | Một lượt 256 seed/kịch bản sau tìm giá; Worker báo progress; không chạy lại full optimize cho từng nồi |
| Bản lưu hoặc kết quả cũ còn trạng thái sai ngày | Normalize trạng thái và đánh dấu kết quả cũ khi đổi input; save lỗi không chặn tính |

### Kiểm chứng cuối

Chạy các lệnh trong mục gia truyền của SPEC: `node --test check-secret.cjs`, core/forecast/Worker/UI, kiểm tra cú pháp và `git diff --check`. Smoke mobile một luồng nhập → tìm → đọc lợi ích → reload → đổi ngày. Ghi kết quả thật vào `tasks/verification.md`; cập nhật README theo phạm vi đã qua test. Commit/push theo quyền đã có; không tuyên bố Pages đã deploy khi chưa kiểm tra.

Không có câu hỏi sản phẩm đang chặn; kế hoạch và task đã được duyệt.


## Kế hoạch: gia truyền tự đề xuất và UI gọn — 02/10/2026

Phạm vi người dùng đã chốt, yêu cầu chuyển sang plan. Căn cứ: CAPABILITY-MAP.md, SPEC-secret-recommendation.md, SPEC-compact-navigation.md. **Plan/task đã được duyệt; đã triển khai. Chỉ đạo cuối: hoàn tất triển khai rồi test core nước lẩu, bỏ kiểm thử UI/browser.** Giữ nguyên R1–R6/S1–S6 đã hoàn tất.

### Quyết định và thứ tự

A1 core auto → A2 người dùng nhận kết quả auto qua Worker/UI → checkpoint core → A3 ba vùng nội dung → A4 menu/input/kết quả gọn → checkpoint luồng dùng → A5 hồi quy, tài liệu, commit/push.

- Core trước UI: chọn nồi thành công theo mean ở cùng bảng giá; giá search có giới hạn hai lượt, không full search mỗi nồi. Recompute stats/baseline/alternatives theo nồi cuối, không dùng số liệu của nồi hạt giống.
- A2 là lát cắt sử dụng được: bỏ trạng thái thủ công, nhớ cấu hình cũ nhưng không dùng secret cũ, đọc nồi tự đề xuất. A3/A4 thay cấu trúc/mật độ, không sửa công thức.
- Giữ contract optimize/Worker hiện có và bổ sung result.secret rõ; helper simulate explicit không xóa để test. Tách helper render/navigation vừa đủ, không framework/router mới.
- Checkpoint nội bộ lưu bằng chứng; kiểm tra toàn hệ thống cuối theo ưu tiên người dùng trước đó. Nếu lỗi quay lại task bị ảnh hưởng, chạy lại checks liên quan. Không thêm vòng duyệt từng task.
- Task chi tiết duy nhất ở A1–A5 tasks/todo.md; mỗi task tối đa5 file. Làm tuần tự, không thêm subagent.

### Rủi ro và xử lý

| Rủi ro | Xử lý |
|---|---|
| Nồi cuối khác hạt giống, thống kê/ranking bị lệch | Batch độc lập theo nồi cuối; baseline cùng nồi, alternatives tính lại; nói rõ giới hạn search |
| Hai search chậm trên mobile | Giới hạn hai lượt, không lặp; Worker/progress; đo thời gian cấu hình full menu khi kiểm tra |
| Giá trị secret cũ ép lựa chọn | Bỏ qua ở optimize, normalize luồng app và kiểm tra old saves; không reset toàn quán |
| Ẩn vùng làm mất state/focus hoặc lỗi khó tìm | State chung, fragment/history, định tuyến lỗi và ghi vị trí; không dựng lại form khi đổi vùng |
| Thu nhỏ làm khó đọc/chạm | Ưu tiên giảm hero/padding/thẻ; mobile44px/font input16px, focus rõ; không smoke theo yêu cầu cuối |
| Nội dung bị thanh dưới/bàn phím che | Safe area, inset động và scroll-padding; bàn phím chưa test thực theo yêu cầu cuối |

### Hoàn tất

Checks core/Worker ở hai spec và kiểm tra cú pháp/diff; không chạy kiểm thử UI/browser theo chỉ đạo cuối. Ghi kết quả thật trong tasks/verification.md, cập nhật README/giới hạn. Commit/push theo quyền đã có; xác nhận Pages riêng. Không có câu hỏi sản phẩm mới ngoài duyệt plan/task.
