# Đối chiếu source game 2.3.8

Kiểm tra: 02/10/2026. Báo cáo đối chiếu nguồn; các thay đổi chương bên dưới đã được đưa vào engine và giao diện. Các mô tả “đang” trong phần phân tích ghi lại lỗi của bản công cụ trước cập nhật.

## Nguồn và cách kiểm tra

- HTML hiện tại: https://aenhatrang.com/
- Bundle do HTML tham chiếu: https://aenhatrang.com/g/0b73001557557d1e26f9.js
- Source khai báo version `2.3.8`, mốc nội dung `30/9/2026`.
- SHA256 bundle tải về: `0dd5250713c42f7666b8a82f2d3deba80ad8fffd451604f0f78ab36a0aa010f7`.
- So sánh với bản đọc source cũ `/g/5f4be5d7038028cafd44.js` đã dùng tạo công cụ ngày 27/09/2026.
- Trích literal để so sánh giá trị, không so tên biến minify. Đọc các hàm tạo khách, tạo app, thu hút, kết thúc ngày, gọi món, đánh giá và nấu. Không chạy bundle game, không đưa bundle của tác giả vào repo.

## Dữ liệu không đổi

Đối chiếu literal cũ/mới cho kết quả bằng nhau:

- 32 nguyên liệu: 9 nước lèo, 21 topping, vắt mì và tô; gồm vốn, giá gợi ý, phí mở, hạn dùng và metadata.
- 64 mục cấp mở khóa.
- 20 trang bị, 6 nhân viên, 13 đồ trang trí.
- 10 loại sự kiện và tham số; 10 mốc XP.
- 7 tham số nền: tiền bắt đầu 400.000, ngày 210 giây, gap 10 giây, thuê 40.000, điện nước 15.000, điện trang bị 6.000, phí app 20%.

Tên và mốc danh hiệu đã đổi: LV1 bán online ở nhà, LV3 xe mì cay dạo, LV5 tiệm nhỏ, LV8 tiệm hai tầng, LV10 chuỗi mì cay. Mốc XP không đổi.

## Thay đổi ảnh hưởng tới thuật toán công cụ

### 1. Chương là thông số độc lập với level

Source thêm `story.st` và 5 chương. Hàm `Ao()` tính trần chương từ level: LV1–2 → 1, LV3–4 → 2, LV5–7 → 3, LV8–9 → 4, LV10 → 5. Hàm `uA()` lấy min(chương lưu, trần theo level).

Lên level chưa chắc lên chương: `ki()`/`tr()` còn kiểm tra mục tiêu chương và chuyển chương cho ngày tiếp theo. Các mục tiêu lần lượt: giao 30 đơn online, két đạt 1 triệu, có 30 đánh giá và trung bình ≥4,3 sao, két đạt 5 triệu. Bản lưu game cũ thiếu story được migrate theo level.

Công cụ hiện chưa có trường chương. Cần cho người chơi chọn chương đang thấy trong game; không tự suy chương chỉ từ level. Với cấu hình công cụ cũ, quy tắc migrate theo level có thể tương ứng cách game migrate nhưng phải nói rõ để người chơi kiểm tra lại.

### 2. Bếp nhà: chỉ đơn app

Source `Se()` bỏ qua khách tại quán khi chương <2. `Cc()` cho app hoạt động ở chương 1 dù chưa mua trang bị app. `ml()` cho tối đa 3 đơn app đang chờ ở chương 1, thay vì 2 ở các chương sau.

Nhịp app: `22 / thuHut × hệSốMưa × hệSốBếpNhà × U(0,7;1,3)`, với hệ số mưa 0,5 và hệ số bếp nhà 0,55. Lượt đầu vẫn ở giây 10, ngừng nhận ở giây 200.

Công cụ đang giả định LV1 có 3 bàn và chưa có app nếu chưa mua trang bị: sai kênh khách, phí app và tip. Cần đổi mặc định LV1 theo chương 1; không được chỉ sửa nhãn.

### 3. Số chỗ theo chương

Source `fl()`: có seat4 → 4; nếu không, chương ≥3 → 3; chương 2 → 2; chương 1 → 0. Tuy `fl()` ưu tiên seat4, `Se()` vẫn chặn khách tại quán trong chương 1.

Công cụ đang dùng 3/4 bàn cố định. Cần đưa chương vào sức chứa và callout sức bếp, giữ riêng giới hạn đơn app.

### 4. Tiền thuê

Source `ct()`: chương ≥3 trả 40.000/ngày; chương 1–2 trả 0. `ca()` vẫn thu điện nước nền 15.000 + 6.000 mỗi trang bị tiêu thụ điện và lương nhân viên.

Công cụ đang luôn tính fixed nền 55.000. Ở hai chương đầu, riêng phần fixed nền đang cao hơn game 40.000/ngày; không thể lấy chênh lệch đó làm tổng sai số lợi nhuận vì kênh khách và sức chứa cũng đổi.

### 5. Thu hút của xe dạo khi mưa/nóng

Source `wi()` thêm hệ số 1,15 khi chương 2 và sự kiện rain hoặc hot. Các hệ số còn lại giữ nguyên: sao, bonus, ngày, buzz, bẩn, tỷ lệ giá mì clamp 0,85–1,6 và bình phương nghịch đảo.

Vì vậy hệ số thời tiết tổng của xe dạo: mưa 1,35×1,15 = 1,5525; nóng 0,8×1,15 = 0,92. Không áp bonus cho chương khác.

### 6. Burst học sinh

Source `Cc()` chỉ tạo thêm 3 lượt học sinh khi chương ≥2. Công cụ đang tạo burst trong sự kiện students ở mọi cấu hình. Cần chặn ở bếp nhà.

## Logic chính vẫn giữ

- Chọn topping theo pha level 1–2/3–6/7+, tối đa 1/2/3 loại, xác suất số topping và trọng số giảm lặp trong 6 tô gần nhất không đổi. Giá topping không tham gia chọn món.
- Ngưỡng chê đắt: nước lèo >60.000×menu, topping >1,5×giá gợi ý×menu; menu quá đắt >2×giá gợi ý×menu. Hệ số menu vẫn 1,2.
- Kiên nhẫn nền, hệ số nhóm/topping, nhịp giờ cao điểm, các ngưỡng đánh giá vì chờ và giá vẫn giữ.
- Chu kỳ luộc 5,2/4,2 giây, Na lấy ở 64%, khoảng khởi động 0,8 giây, overtime 60 giây vẫn giữ.

Rửa tô, công thức bí truyền, giao xa và các drama đã có trong source cũ; không gán chúng thành tính năng mới của đợt cập nhật này. Công cụ chưa mô phỏng một số cơ chế đó, vẫn là giới hạn đã công khai.

## Kết luận và phạm vi sửa đề xuất

**Cần cập nhật engine và một trường nhập chương, không cần làm lại UI hoặc bảng giá nguyên liệu.** Ưu tiên sửa bếp nhà và xe dạo, vì khác biệt trực tiếp làm sai lợi nhuận và giá tối ưu. Với chương ≥3, các công thức lõi đã kiểm tra vẫn gần mô hình hiện có, trong những giới hạn đã công khai.

Thứ tự sửa khi triển khai: thông số chương + migrate → thu hút/fixed/sức chứa/kênh app/burst → callout và hướng dẫn → kiểm tra 5 chương và Worker. Giữ mobile, tự nhớ đơn giản và số lượt mô phỏng; không bổ sung import JSON hoặc test UI rộng.

Kiểm tra cần thêm: chương 1 không có khách tại quán và có app dù không upg; chương 2 có 2 chỗ, không thuê và bonus rain/hot; chương 3+ thuê 40k và 3/4 chỗ; cấu hình level cao nhưng còn chương thấp; tính app fee và công suất theo cùng seed.

## Kết quả triển khai

Engine/giao diện đã cập nhật các quy tắc chương trên, phân biệt lượt nhận app/khách tại quán và số tô thực giao. Bộ kiểm tra core bao phủ 5 chương và 1.000 seed cho ngày đầu kim chi 30k: trung bình 22,688 tô, phạm vi 20–25, có 140 seed giao 24 tô. Đây là đối chiếu với tốc độ và menu mặc định, không tái lập chính xác phiên chơi của người dùng. Tô hướng dẫn đầu game có đồng hồ tạm dừng chưa mô phỏng; các giới hạn cũ vẫn được ghi trong giao diện/README. Xem tasks/verification.md cho checks và smoke mobile.

## Rà lại core và số dự đoán ngày 2

Kiểm tra lại ngày 02/10: HTML vẫn trỏ cùng bundle, SHA256 không đổi. Đọc lại wi/so, rt, io, Ls/ae, $s, Cc/Se/ml, pc/Ee, Ws/Ks, đánh giá và giao món/fee/tip. Giá nguyên liệu, phân bố topping, thời hạn và quy tắc chương đã ghi ở trên giữ nguyên.

- `so() = round(210 × wi() / 10 × 0,95)`: công thức chung dùng trước nhập hàng, không phụ thuộc kênh bán hoặc sức bếp. Source vẫn dùng nó khi chương 1 chỉ nhận app. App thực tế có lượt đầu ở giây 10, dừng nhận trước giây 200, interval `22/wi × 0,55 × U(0,7;1,3)` ở bếp nhà. Vì vậy không thể so trực tiếp số so() với tô thực giao.
- Fixture đối chiếu: LV1/chương 1, ngày 2, giả định 5 sao/30 đánh giá cùng mức, 5 đồ trả tiền, kim chi 30.000, bò 22.000, xúc xích 12.000, rau 7.000; action 0,45, overhead 1,2. Thu hút đầu ngày 1,830286; game dự đoán 37; 256 seed cuối phục vụ trung bình 28,800781 tô app, min 27, max 32. Chưa có đủ toàn bộ trạng thái thực tế của người dùng để nhận đây là tái lập tuyệt đối phiên chơi.
- Dự đoán trước cửa dùng LED 0,25×0,45 và buzzNext; không áp sàn bẩn trong ca. Engine mô phỏng vẫn dùng LED theo thời điểm, buzz và bẩn của ca. Sự kiện auto chưa xác định được hiển thị bằng trung bình dự đoán theo từng sự kiện rút trong batch.
- Sửa default thu hút của engine: reviews=0 phải dùng 4 sao, kể cả caller gửi một mức sao khác. Trước đây UI đã chuẩn hóa nhưng helper core dùng s.stars, có thể lệch chỉ số thu hút đầu ngày.
- Giá tốt nhất tiếp tục chọn theo lợi nhuận trung bình sau chi phí trên 160 ngày của finalist, sau đó đánh giá lại bằng 256 seed mới. Không chọn theo số tô trung bình.
- `servedMin/servedMax` là cực trị số tô thực giao của đúng tập seed trong batch, không phải khoảng tin cậy hoặc min/max lý thuyết. Thực tế có thể nằm ngoài mẫu.

Kiểm chứng: 7 test TDD ở check-forecast.cjs có RED trước GREEN; checks cũ core/Worker/UI đều qua, Worker có thêm fixture ngày 2 và kiểm tra min/max, xếp hạng theo lợi nhuận. Một phép đối chiếu tại máy chạy riêng hàm `wi` trích từ bundle qua 600 cấu hình (không chạy toàn bộ game) khớp engine với sai số <1e-10: level/chương, sao/no reviews, decor, trang bị/menu/LED, event, giá sàn/trần, buzz, bẩn, preview/sell. Script đối chiếu cục bộ /tmp/mi-cay-core-oracle.cjs; không đưa source bundle vào repo.

Core vẫn là mô hình phục vụ lý tưởng đã công khai; audit này không chứng minh mọi nhánh của game giống hệt mô phỏng. Không giả lập drama, giao xa, thiếu hàng, phản hồi, rửa tô hoặc lên cấp giữa ca. Lợi nhuận mô hình là vốn phần tiêu thụ, còn tiền/lãi game có thể phản ánh nhập tồn kho và nhiệm vụ/thưởng.
