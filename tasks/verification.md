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

## TDD: dự đoán game và min–max tô

- RED: check-forecast có 6 test fail (thiếu gameForecast/min–max, reviews=0 vẫn dùng sao nhập); GREEN sau sửa core. Test thứ 7 về event cấu hình fail trước khi helper nhận đúng event, rồi GREEN. Không skip test.
- PASS node --test check-forecast.cjs: repro 37 vs 28,8, min/max đúng 64 seed độc lập, trung bình/SE, n=1 và n sai, no reviews, LED preview/bẩn, giá topping/menu/sàn/trần, mưa/xe dạo/cuối tuần.
- PASS check.cjs (5 chương/thu chi/1.000 seed), check-ui.cjs, check-worker.cjs (LV1/ngày2/LV9, snapshot/progress/id/error, min–max và xếp hạng lợi nhuận), syntax app/engine/worker, diff whitespace.
- PASS đối chiếu source wi trực tiếp ở /tmp/mi-cay-core-oracle.cjs: 600 cấu hình, sai số <1e-10. Bundle tải lại hash giống báo cáo source. Phép audit này không phụ thuộc việc khẳng định toàn bộ game đã được mô phỏng.
- Browser mobile 390×844: ngày 2, 5 sao/30 đánh giá, 5 decor, kim chi/bò/xúc xích/rau 30k/22k/12k/7k; Worker tìm giá xong, khuyến nghị giữ đúng các giá đó; UI hiện 28,8 trung bình / 27–32 mẫu / 37 dự đoán game, tô tại quán 0. scrollWidth=390, console không có error/warn. Ảnh mobile-forecast-range.jpg. Viewport reset sau test.
- Không mở rộng ma trận UI hoặc dependencies. Dự đoán 37 không phải số đơn app cam kết; min/max là mẫu 256 ngày, không giới hạn lý thuyết.

Bản core/UI `ec6cb1c` đã push lên origin/main. Chưa kiểm tra Pages triển khai.


## Gia truyền — hoàn tất và kiểm chứng 02/10/2026

Người dùng duyệt spec, plan/task và yêu cầu code toàn bộ rồi test kỹ. Làm tuần tự S1–S6; không tuyên bố RED trước code ở đợt này.

### Thay đổi

- `secret` lưu trạng thái/nồi/ngày; record cũ mặc định none. Input mobile thu gọn; đổi ngày hoặc menu/level không còn hợp lệ thì bỏ hiệu ứng, đánh dấu kết quả cũ. Save best effort.
- Nhóm hoàn tất: +1 sao nếu có tô đúng nồi và rating <5; online có sao nhưng không tip gia truyền. Tại quán 2k/tô match sau hũ tip và trước mèo/payday; reviewer ghi rating cuối ba lần. Nhóm giao dở/bỏ về không nhận thưởng hoàn tất. Tách số tô match đã giao, match hoàn tất, nhóm thực nhận sao và tip trực tiếp.
- Optimize dùng trạng thái thật; comparator so none/từng nồi giả định đúng trên cùng giá và 256 seed. Khóa/active chỉ so nồi đã chọn; hết lượt/ngày <3 không đề xuất. Không mutate input; không chạy full optimize riêng 9 nồi; uncertainty dùng chênh lệch từng cặp seed.
- Source 2.3.9: literal 32 nguyên liệu/20 trang bị/6 nhân viên, giá/vốn/hạn dùng/phí mở/mốc level/traffic/need/lương, 10 sự kiện và 7 tham số nền khớp data sau chuẩn hóa giá trị thiếu. Đọc các nhánh đang mô phỏng, audit ghi rõ phạm vi; không đưa bundle vào repo, không đổi catalog.

### Kiểm tra thực tế — PASS

- `node --test check-secret.cjs`: **15/15**. Nhóm 1–3 tô với 0..n match cho cả 9 nước lèo; sao đã 5, chê đắt/bù rẻ, hũ tip/tô sứ/mèo/payday, reviewer, nhóm chưa xong, ngày 1–2/stale/locked/exhausted, migration và giá invalid.
- Ma trận riêng 9 nồi × 3 kênh × có/không buff × 12 seed = **648** ngày kiểm tra ledger/counts. Menu trộn 5 mốc chương × 4 biến thể × 16 seed = **320** ngày kiểm tra thêm, có trường hợp giao dở, quá tải, topping/menu màu/sao thấp/giá cao/payday/reviewer/rain. Các batch kiểm tra min–max dùng đúng seed mô phỏng.
- Comparator đủ 9 nồi + none, mỗi phương án 256 seed: stats khớp batch độc lập ở cùng giá/seed, ranking theo profit, không mutate; single-broth và trường hợp không có lợi ích báo bất định đúng.
- Hồi quy trực tiếp **600** lượt không gia truyền so toàn bộ output cũ (bỏ 4 trường thống kê mới): giống engine trước cập nhật theo seed. Lưu 6 fixture kết quả cũ cố định trong `check-secret.cjs` để bảo vệ RNG và sổ tiền.
- `node check.cjs`: core 5 chương, traffic/capacity/fee/cost/rent/overload PASS; 1.000 ngày LV1/kimchi30k giữ mean22.688, min20/max25, 140 ngày có đúng24 tô.
- `node --test check-forecast.cjs`: **7/7**, giữ repro ngày2 dự đoán37 và số tô thực giao trung bình28.8; phân biệt forecast/min–max/CI.
- `node check-worker.cjs`: **6 cấu hình**, Worker khớp engine gồm LV1/ngày2/LV9, active online, locked tomyum, full menu active riêu/payday cùng hũ tip/tô sứ/mèo/menu/nồi; stats active khớp hàng comparator tương ứng. Progress/request id, error config và mã topping làm nồi gia truyền bị chặn.
- `node check-ui.cjs`, `node --check engine.js`, `node --check app.js`, `node --check worker.js`, `git diff --check`: PASS. UI check chạy lại sau sửa câu thông báo một nồi.
- Smoke browser thực 390×844: ngày3 → active kimchi → Tìm giá qua Worker → đọc kết quả → reload còn active → đổi ngày4 thành none và stale → trả ngày2 ban đầu. Console warn/error trống. Giá phía trên tính active, online tip0; thẻ so sánh đọc được trên mobile. Viewport override đã reset.
- Ảnh kiểm chứng: `/Users/khoadanganh/Downloads/mi-cay-gia-truyen-mobile.jpg`. Ca smoke LV1/chương1/day3, 5sao/30reviews/decor5, kimchi30k/bo22k/xucxich12k/rau7k và event auto: active mean34.3 tô/min25/max46, tip gia truyền0, profit636241; cùng giá none profit633394, delta2846, CI1571..4122. Đây là cấu hình minh họa, không phải kết quả đảm bảo cho mọi quán.

Lần chạy đầu có một assertion fixture sai: chọn chương tại quán cho trường hợp giả định không có lợi ích, dù tại quán luôn thêm tip2k. Đổi fixture sang online nhanh/giá rẻ; chạy lại đầy đủ PASS. Không bỏ hoặc hạ tiêu chí test để che lỗi.

### Rà chất lượng và giới hạn

Rà diff theo correctness/readability/architecture/security/performance: dùng một helper rating/tip trong simulate và tests, không có engine lợi nhuận thứ hai; validate input/Worker snapshot, encode tên món; không thêm dependency/network trong app; so sánh bị chặn ở tối đa10×256 lượt và chạy nền. Không có issue bắt buộc còn mở.

Giới hạn giữ nguyên: pipeline bếp lý tưởng, đủ hàng, sai số tốc độ/thứ tự thao tác và sao đầu ngày xấp xỉ, không mô phỏng drama/du lịch/giao xa/reply/đổi level giữa ca. Không giải minigame hoặc tính xác suất nhớ đúng; một ngày, cùng bảng giá, tối ưu trong tập đã thử. Min–max là mẫu; CI chỉ mô tả nhiễu mô phỏng, không sai số mô hình. Push và Pages là các bước riêng; chỉ xác nhận deployment khi có bằng chứng.
