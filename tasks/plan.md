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
