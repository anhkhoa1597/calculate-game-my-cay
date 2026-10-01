# Kiểm tra bản mobile gọn — 02/10/2026

Triển khai hết phần code rồi mới chạy checks theo yêu cầu người dùng.

- PASS `node check.cjs`: thu hút, ngưỡng giá, seed tái lập, quá tải/công suất, sổ lợi nhuận và validation.
- PASS `node check-worker.cjs`: Worker source khớp engine trực tiếp LV1/LV9, progress/request id và lỗi validation.
- PASS `node check-ui.cjs`: restore cấu hình/giá cũ, bản hỏng về mặc định và ghi mới được, bản hợp lệ không bị input sai ghi đè, lỗi storage ở boundary; rỗng/range/step, tìm không dấu/lọc và khuyến nghị tăng/giảm/nhiễu/an toàn.
- PASS syntax app/engine/worker và `git diff --check`.
- Browser thật trong Codex tại localhost: nhập ngày 3/giá 41.000; tìm “pho mai” hiện hai món đúng; đổi lọc; Tìm giá; có đủ kết quả lợi nhuận/tô/mất khách/sao; Dùng giá; reload giữ ngày 3 và giá 30.000 khớp giá đã áp dụng. Không còn nút export/recovery; console không có lỗi.
- Độ rộng CSS thực 390/320/1200: scrollWidth bằng innerWidth, không tràn ngang. Ảnh mobile ở `mobile-proof.jpg`.
- Review đường save/submit: save catch lỗi và trả false; submit vẫn dùng snapshot hợp lệ, không phụ thuộc save thành công. Không tiêm lỗi localStorage trong browser.
- Không sửa engine.js/game-data.js hay số lượt mô phỏng. Không kiểm thử điện thoại vật lý/Lighthouse/ma trận UI cũ theo spec đã rút gọn.
- Không xác nhận GitHub Pages đã triển khai từ việc push.

Bản code `c1fec18` đã push thành công lên `origin/main`. Checklist hoàn tất theo spec mới; Pages chưa được kiểm tra triển khai.

## Cập nhật game 2.3.8 — 02/10/2026

- PASS core: 30 seed mỗi chương; trần chương theo 10 level, app tự bật chương 1, 3/2 slot, chỗ 0/2/3/4, thuê theo chương, bonus mưa/nóng chỉ chương 2, không burst học sinh chương 1. Giữ chương 1 dù level cao và đã mua thêm bàn.
- PASS sổ tiền: doanh thu theo số phần từng món, vốn mỗi tô (tô+mì+nước+topping), app 20%, tip app thường 0, chi phí cố định, lợi nhuận; thu hút/ngưỡng giá, seed tái lập và quá tải/công suất.
- 1.000 seed LV1/ngày 1, kim chi 30.000đ, bò và xúc xích giá mặc định, action 0,45s, extra 1,2s: trung bình 22,688 tô app, min 20, max 25, 140 lượt đúng 24. Không tính tô hướng dẫn, không hiệu chỉnh tham số theo số 24 của người dùng.
- PASS Worker LV1 chương 1 và LV9 chương 4 khớp optimize trực tiếp, request/progress/error; giữ 256 lượt final/baseline và 160 mỗi finalist, giá bội 1.000 và trong ngưỡng an toàn. Tìm giá vẫn là heuristic có giới hạn, không chứng minh tối ưu toàn cục.
- PASS UI logic: migrate thiếu chương theo level có nhắc kiểm tra, explicit chương thấp được giữ và lưu lại, chương vượt cấp bị chặn; checks cũ storage/input/lọc/quyết định vẫn qua.
- PASS cú pháp app/engine/worker và diff whitespace.
- Browser mobile 390px: chọn LV5/chương 3, reload giữ chương; giảm LV1 tự hạ chương 1; tính Worker hoàn tất, toàn bộ tô là app, tại quán 0, fixed 15.000 và tip 0; áp dụng giá và reload giữ chương. Không tràn ngang (scrollWidth = innerWidth = 390), console không lỗi. Dùng cấu hình thử đang lưu gồm 3 topping, không coi đây là fixture 2 topping của kiểm tra core. Ảnh: mobile-game-2.3.8.jpg.
- Smoke phát hiện đường input level chưa cập nhật giới hạn chương ngay: đã cho xử lý thay đổi level từ input và kiểm tra lại thành công. Các lỗi assert ban đầu là fixture quá tải chưa đủ chậm, trường metadata event và sai số float; sửa fixture/so sánh rồi chạy lại toàn bộ checks.
- Không thêm dependency, không đưa bundle game vào repo. Các nhánh drama/minigame ngoài core vẫn là snapshot trích 27/09; chỉ các rule/data ghi trong báo cáo audit được đối chiếu lại.

Code 2.3.8 `634780a` đã push lên origin/main. Chưa xác nhận GitHub Pages triển khai bản mới.
