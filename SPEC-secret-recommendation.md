# Spec: secret-recommendation

Phạm vi đã chốt trong CAPABILITY-MAP.md; ghi rõ kỹ thuật để lập plan, đã duyệt triển khai. Thay thế luồng trạng thái gia truyền thủ công của SPEC.md:195, giữ nguyên công thức buff đã kiểm chứng.

## Mục tiêu
App đề xuất nước lèo gia truyền nào trong menu khi luôn giả định làm đúng; người dùng không nhập trạng thái hoặc chọn nồi trước. Ngày >=3 sau hướng dẫn mới có gia truyền; ngày 1–2 giữ tính toán không buff. Cấu hình lưu cũ không khóa lựa chọn theo secret cũ.

## Hành vi và hợp đồng kết quả
- So các nước lèo đã mở và đang bán, luôn giả định active đúng ngày. Không gia truyền chỉ là mốc giải thích lợi ích, không cạnh tranh để được chọn làm nồi đề xuất. Một nồi vẫn được đề xuất kể cả hòa mốc none; nhiều nồi hòa/nhiễu chọn đầu theo quy tắc ổn định và ghi chưa phân biệt rõ.
- Chọn theo profit trung bình trên 256 seed dùng chung, không chọn theo giá niêm yết/số tô hoặc max profit của từng ngày riêng. CI chênh lệch là từ các cặp ngày, không phải chứng minh tối ưu toàn cục.
- Tất cả stats hiển thị chính dùng cùng nồi đề xuất, giá đề xuất, ngày và 256 seed. Baseline giá hiện tại dùng cùng nồi để so giá; mốc none riêng để giải thích gia truyền. Forecast vẫn là trước mở cửa, không nâng sao sớm.
- optimize trả prices/stats/baseline/alternatives/tested như hiện tại, bổ sung nồi đề xuất trong result.secret (mode auto hoặc unavailable), rows so nồi ở cùng giá, nhãn uncertainty và số lượt/bảng giá thử có nghĩa rõ. Giao diện chỉ đọc kết quả engine; không tính công thức riêng.
- Public simulate/batch và completeGroup vẫn hỗ trợ secret explicit để test cơ chế và chạy scenario. Luồng optimize của app tự quyết định, bỏ qua secret cũ; không tự mua/mở/bỏ món và không tự nhận người chơi thật đã thành công.

## Giá và đề xuất nồi
Giữ search grid/coordinate hiện có. Khởi tạo bảng giá không buff → so nồi để lấy nồi hạt giống → chạy thêm tối đa một search với buff nồi đó → so mọi nồi lại ở bảng giá cuối. Nồi đứng đầu theo mean tại bảng giá cuối là đề xuất; kể cả đổi nồi, stats phải lấy đúng hàng so cuối. Không lặp đến hội tụ hoặc chạy full search cho từng nồi. Bảng giá là đề xuất từ tìm kiếm có giới hạn, không hứa tối ưu đồng thời giá+nồi. Alternatives nếu hiện phải được đánh giá lại với nồi cuối, và không gọi giá được chọn là cao nhất của một ranking tính bằng nồi khác.

## Kiểm thử và nghiệm thu

Cập nhật theo chỉ đạo cuối: triển khai tuần tự rồi test core nước lẩu; không chạy kiểm thử UI/browser. Các điều kiện UI dưới đây là yêu cầu triển khai, không phải bằng chứng đã test.

- Ngày 1–2, menu một nồi/cả 9 nồi, online/tại quán/hỗn hợp, sao thấp/cao, nhanh/chậm/quá tải, payday/menu màu/topping: giá hợp lệ, ledger đúng, nồi hợp lệ và stats khớp batch độc lập.
- Không chọn none, không chọn theo seed thuận lợi, giữ cùng giá/seed khi so, xử lý hòa ổn định; snapshot/input không mutate; secret cũ locked/exhausted/active không đổi kết quả auto.
- Worker/direct khớp kể cả result.secret; progress/request id/error vẫn đúng. Giữ regression công thức gia truyền, forecast37 ngày2, min–max và core 5 chương. Budget tối đa hai search, một lượt so nồi khởi tạo và một lượt so cuối; báo progress cho mobile.

## Stack, cấu trúc và style
HTML/CSS/JavaScript thuần; engine.js và game-data.js cung cấp mô hình, worker.js chạy tính nền, app.js/index.html/style.css quản lý UI; checks Node native ở root, tài liệu ở tasks/. Không thêm dependency/build. camelCase, native API, tên món encode khi render HTML.

```js
const config = structuredClone(state);
const result = await Model.optimize(config, reportProgress);
// Không ghi kịch bản giả định trở lại state.
```

## Lệnh
```sh
cd /Users/khoadanganh/Documents/Codex/mi-cay-planner
python3 -m http.server 8765 --bind 127.0.0.1
node --test check-secret.cjs
node --test check-forecast.cjs
node check.cjs
node check-worker.cjs
node --check engine.js
node --check app.js
node --check worker.js
git diff --check
```

## Ranh giới
- Luôn: validate input, giữ mô hình tiền/sao/thời gian của source, test core kỹ, UI mobile là chính, save best effort và giữ dữ liệu hợp lệ khi đổi vùng.
- Trao đổi trước: full optimize riêng từng nồi, framework/dependency mới, thay luật hoặc phạm vi mô phỏng game.
- Không: import/export JSON, giả min–max là bảo đảm, tự thao tác game, tuyên bố Pages deploy khi chỉ mới push.
