# Spec: compact-navigation

Phạm vi đã chốt trong CAPABILITY-MAP.md, phụ thuộc secret-recommendation. Dùng UI/UX Pro Max theo audit trong capability map, giữ màu/type hiện có. Chưa triển khai.

## Mục tiêu
Dùng điện thoại không phải cuộn tìm chức năng trên một trang dài. Ba vùng Quán/Menu/Kết quả chỉ hiện một vùng tại một thời điểm, đổi vùng một thao tác và không mất cấu hình/từ khóa/filter/scroll. Desktop dùng cùng chức năng, không thiết kế riêng phức tạp.

## Hành vi và bố cục
- Header một hàng ngắn; bỏ hero cao và lời giải thích lặp. Thanh điều hướng ba nhãn rõ, thể hiện vùng đang chọn; dùng fragment/history cho deep link/back và chuyển đúng vùng khi lỗi input.
- Quán: thông số thường dùng trước, tốc độ/trang bị/điều kiện nâng cao thu gọn. Bỏ nhóm nhập trạng thái/nồi gia truyền; chỉ thông báo ngắn app giả định thành công từ ngày3.
- Menu: tìm món/filter ở đầu vùng, dễ quay lại; hàng món gọn gồm chọn bán, tên, giá hiện tại, giá đề xuất. Vốn/level/mở món là metadata nhỏ, không thành một thẻ lớn nhiều dòng; không mất món đang chọn khi lọc.
- Kết quả: tên nồi gia truyền + giá đề xuất + lời + tô mean/min–max nổi bật. Forecast có nhãn riêng. Thu chi, hao hụt/mất khách, xếp hạng nồi/phương án, data/công thức để đóng mặc định. Đủ chỉ số cũ để người dùng mở xem.
- Tìm giá luôn dễ tới ở cả ba vùng; không che input/nội dung/focus khi bàn phím mở. Tính thành công chuyển sang Kết quả có cân nhắc focus; lỗi chuyển vùng chứa trường sai. Dùng giá cập nhật state và đánh dấu kết quả cũ; tính nền không mất vị trí nhập.
- Input/select mục tiêu 44px mobile thay48px; desktop khoảng36–40px. Nút phụ giảm padding/diện tích nhìn nhưng vùng chạm rõ; font input16px, labels12–14px, padding nhóm12px/gap8px thay16–24px. Không dùng font nhỏ để ép nội dung; thu nhỏ cấu trúc trước.
- localStorage chỉ nhớ cấu hình hợp lệ, không bắt người dùng quản lý storage; vùng đang xem có thể giữ trong phiên. Giữ reset/hủy reset, validation và trạng thái tính rõ.

## Kiểm thử và nghiệm thu
- Node check-ui kiểm tra state/migration/validation nếu đổi; browser smoke các luồng đổi vùng, tìm/filter/giá, tính→kết quả, dùng giá, lỗi chuyển đúng vùng và reload.
- Kiểm tra 390px và liếc320px: không tràn ngang trang, tìm món dễ tới, không che bởi thanh cố định; keyboard/focus/Back/nhãn/selected rõ. Không mở rộng matrix UI hoặc Lighthouse.
- Core/Worker không đổi công thức vì layout; result.secret auto hiển thị đúng, không còn điều khiển trạng thái gia truyền thủ công. Không thêm framework hoặc UI dependency.

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
node check-ui.cjs
node --check engine.js
node --check app.js
node --check worker.js
git diff --check
```

## Ranh giới
- Luôn: validate input, giữ mô hình tiền/sao/thời gian của source, test core kỹ, UI mobile là chính, save best effort và giữ dữ liệu hợp lệ khi đổi vùng.
- Trao đổi trước: full optimize riêng từng nồi, framework/dependency mới, thay luật hoặc phạm vi mô phỏng game.
- Không: import/export JSON, giả min–max là bảo đảm, tự thao tác game, tuyên bố Pages deploy khi chỉ mới push.
