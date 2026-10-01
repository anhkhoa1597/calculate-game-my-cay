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
