# Spec: Sổ giá Tiệm Mì Cay — ưu tiên mobile

Cập nhật: 02/10/2026. Người dùng đã duyệt phạm vi mới. Bản này thay thế phạm vi UI/lưu trữ/kiểm thử của spec trước; hợp đồng tính toán vẫn giữ nguyên.

## 1. Mục tiêu và ưu tiên

Công cụ tĩnh giúp người chơi nhập tình trạng quán trên điện thoại, tìm bảng giá có lợi nhuận tốt trong các phương án mô phỏng và biết bếp có phục vụ kịp khách hay không.

Thứ tự ưu tiên:

1. Tính đúng giá, vốn, lợi nhuận và sức phục vụ theo thời gian.
2. Nhập thông số, chọn món, đọc và dùng giá thuận tiện trên mobile.
3. Tự nhớ thông số hiện tại để lần sau không nhập lại.
4. Desktop dùng được cùng chức năng; không cần thiết kế hoặc kiểm thử chi tiết riêng.

Đây là công cụ hỗ trợ chơi game, không phải dashboard quản trị hay hệ thống quản lý dữ liệu. Giữ tên Sổ giá, tiếng Việt và GitHub Pages.

### Diễn giải phạm vi mới

- “Tìm món” trong luồng tính là nút Tìm giá cho quán. Tìm tên món trong menu chỉ lọc danh sách.
- Bỏ import JSON. Xuất JSON và phục hồi bản lưu gốc cũng không cần trong luồng sản phẩm gọn này; có thể bỏ các nút/phần xử lý tương ứng đang tồn tại.
- localStorage là tiện ích phụ. Lỗi lưu không được chặn tìm giá hoặc tạo yêu cầu phục hồi trước khi tiếp tục.
- Giảm kiểm thử UI, không giảm kiểm thử tính toán hay số ngày mô phỏng.

## 2. Luồng sử dụng trên mobile

### Nhập quán

- Mở trang: đọc cấu hình đã nhớ; chưa có hoặc không đọc được thì dùng cấu hình LV1.
- Đặt thông số chính lên trước: cấp, ngày, sao, số đánh giá, sự kiện.
- Tốc độ thao tác và thời gian đọc/chuyển đơn dễ tìm, kèm hướng dẫn ngắn để người chơi đo thực tế. Thời gian luộc được tính riêng.
- Trang bị, nhân viên và điều kiện bổ sung dùng nhóm thu gọn để trang không quá dài.
- Không có đánh giá thì dùng 4 sao. Nếu nhập sao khi chưa có đánh giá, giải thích việc dùng xấp xỉ 30 đánh giá.
- Giảm cấp bỏ lựa chọn không còn đủ cấp và báo ngắn; tăng cấp không tự mua/chọn món.

### Chọn menu

- Nhóm nước lèo và topping riêng; mặc định hiện các món có thể mở ở cấp hiện tại.
- Có lọc Đang bán / Theo cấp / Tất cả và tìm tên có hoặc không dấu.
- Lọc chỉ thay danh sách nhìn thấy, không xóa giá hoặc lựa chọn.
- Món khóa ghi Cần LVx. Chọn tất cả theo cấp chỉ chọn món, không chọn trang bị/nhân viên; nhắc người chơi chỉ chọn các món thực sự đã mua mở khóa.
- Mỗi món là một khối dễ đọc trên mobile: tên, trạng thái bán, vốn, giá hiện tại, giá đề xuất.
- Giá nền gồm tô + mì + nước lèo. Topping cộng riêng. Giữ bước giá 1.000đ và giới hạn game.
- Chưa tính ghi Chưa tính; thay thông số thì đề xuất cũ ghi Cần tính lại.

### Tìm và dùng giá

- Nút Tìm giá luôn dễ tới; điều hướng Quán / Menu / Kết quả giữ nhãn và anchor hiện có.
- Khi bấm: kiểm tra đầu vào, nhớ cấu hình hợp lệ và tính trên snapshot đó. Việc lưu thất bại không ngăn tính.
- HTTP(S) dùng Worker để trang vẫn cuộn và đọc được. Khóa chỉnh cấu hình trong lượt tính, có tiến độ và thông báo lỗi.
- Kết quả ưu tiên: lợi nhuận/ngày, chênh lệch so với giá hiện tại, số tô thực sự phục vụ, mất vì đầy, hết kiên nhẫn, chưa xong khi đóng và sao cuối ngày.
- Nói rõ nên thử giá mới, nên giữ giá hoặc chưa đủ bằng chứng. Giá cũ ngoài ràng buộc an toàn phải được giải thích riêng.
- Lợi nhuận âm, bếp quá tải hoặc sao giảm có cảnh báo ngắn. Không hứa đổi giá luôn tăng lời.
- Chi tiết thu chi, khách/thời gian chờ, phương án khác, tiêu thụ và giả định đặt trong phần có thể mở.
- Dùng giá chỉ cập nhật các giá trong công cụ và tự nhớ lại; người chơi tự chỉnh trong game. Sau đó cần tính lại để so với mốc mới.

## 3. Giao diện và khả năng sử dụng

### Mobile là bản chính

- Một cột; không kéo ngang toàn trang hoặc bảng menu/kết quả. Bảng data gốc có thể cuộn trong vùng riêng.
- Giới thiệu ngắn, không hero lớn hoặc nội dung trang trí lấn phần nhập.
- Chữ nội dung/input khoảng 16px, helper từ 12px; nút/vùng chạm ít nhất 44px, ưu tiên 48px.
- Thanh dưới tôn trọng safe area và không che ô nhập. Khi bàn phím làm vùng nhìn nhỏ lại có thể thu gọn thanh hoặc đưa về luồng trang.
- Không giật focus khi đang nhập hoặc tự kéo người đang đọc sang vùng khác lúc tính xong.
- Dùng label, button, input, details native; lỗi có chữ, không chỉ đổi màu. Không khóa zoom của trình duyệt.
- Giữ màu nhận diện đỏ gạch, font hệ thống và cấu trúc sáng/tối đang có. Không mở rộng đợt này thành dự án design system.

### Desktop là bản phụ

- Dùng cùng nội dung và chức năng, giới hạn chiều rộng để đọc thuận tiện.
- Một cột hoặc hai cột đều được nếu dùng được và không tràn trang.
- Không yêu cầu bố cục riêng, biểu đồ riêng, breakpoint chi tiết hoặc tối ưu pixel cho từng độ rộng máy tính.

## 4. Tự nhớ thông số — đơn giản và không chặn tác vụ

- Giữ key `mi-cay-planner-v1` và cấu trúc cấu hình hiện có khi còn hợp lệ.
- Tự lưu khi cập nhật thông số quán, chọn/bỏ món, chỉnh giá, trang bị/nhân viên; lưu lại khi bấm Tìm giá hoặc Dùng giá.
- Chỉ ghi cấu hình hợp lệ. Ô rỗng hoặc giá sai trong lúc nhập không biến thành 0/NaN rồi ghi đè cấu hình hợp lệ trước đó.
- Reload khôi phục thông số và bảng giá đã lưu; không cần lưu kết quả mô phỏng, lịch sử, nhiều hồ sơ hoặc trạng thái bộ lọc.
- localStorage không khả dụng: vẫn nhập và tính bình thường; chỉ báo ngắn rằng thông số có thể không được nhớ sau reload. Không báo Đã lưu khi thực tế chưa lưu.
- Bản lưu hỏng/không tương thích: dùng LV1, báo ngắn và cho cấu hình hợp lệ mới thay thế khi cập nhật/tìm giá. Không giữ raw để xuất, không màn phục hồi, không khóa lưu chờ xác nhận.
- Không có import/export JSON, đồng bộ, backup hay quản lý phiên bản dữ liệu.
- Về LV1 có xác nhận gọn để tránh bấm nhầm; không cần hệ thống hoàn tác.

## 5. Hợp đồng tính toán

Giữ `engine.js`, `game-data.js`, `M.validate`, `M.optimize`, `M.batch`, `M.simulate`, catalog, seed và số lượt kiểm chứng hiện tại. UI không viết một công thức lợi nhuận khác.

- Vốn tô = 1.500đ tô + 3.000đ mì + vốn nước lèo + vốn topping.
- Thu hút phụ thuộc giá mì trung bình, sao, ngày, trang bị, buzz, sự kiện và điều kiện quán.
- Giá topping không đổi xác suất chọn topping; giá cao vẫn có thể gây từ chối hoặc trừ sao.
- Mô phỏng bàn, nhóm khách, app, kiên nhẫn, nồi chạy song song, thời gian thao tác, 210 giây nhận khách và tối đa 60 giây phục vụ nốt.
- Lợi nhuận gồm vốn, phí app, tip, thuê nhà, điện/nước, điện trang bị, lương và hao hụt.
- “Tốt nhất” chỉ trong tập bảng giá đã thử, theo mục tiêu lợi nhuận một ngày; không chứng minh tối ưu toàn cục hoặc dài hạn.
- Khoảng tin cậy chỉ phản ánh ngẫu nhiên mô phỏng, không bao gồm sai số tốc độ và cơ chế chưa mô phỏng.
- Data vẫn là snapshot 27/09/2026. Giữ giải thích giới hạn về thiếu hàng, nhiệm vụ/thưởng, drama, giao xa, mặc cả, công thức bí truyền, du lịch, phản hồi review, lên cấp giữa ngày và phí đầu tư.
- File trực tiếp có fallback tính trên main thread và báo có thể chậm. Worker lỗi trả trang về trạng thái có thể dùng lại; không tự nhận kết quả của snapshot khác.

## 6. Stack, cấu trúc và code style

HTML/CSS/JavaScript native, localStorage, Worker; không thêm dependency, bundler hoặc backend.

```text
index.html       Form, menu và kết quả
style.css        Bố cục ưu tiên mobile, trạng thái, màu sáng/tối
app.js           Nhập liệu, tự nhớ, lọc menu, hiển thị và điều phối tính
worker.js        Snapshot → tiến độ/kết quả/lỗi
engine.js        Mô phỏng/tìm giá, giữ nguyên
game-data.js    Catalog và 21 bảng trích game
check.cjs        Kiểm tra tính toán bằng Node assert
check-worker.cjs Đối chiếu Worker với engine
check-ui.cjs     Kiểm tra logic UI có ý nghĩa, không dựng bộ test layout lớn
README.md        Hướng dẫn chạy và giới hạn
tasks/plan.md    Thứ tự chỉnh phần còn lại
tasks/todo.md    Checklist theo phạm vi mới
```

Tên JavaScript camelCase, CSS kebab-case. Dùng API có sẵn, escape dữ liệu khi dựng markup. Lưu chỉ là một thao tác best-effort:

```js
function rememberSettings(settings) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}
```

Caller kiểm tra cấu hình trước khi lưu; nếu hàm trả false vẫn tiếp tục tính giá.

## 7. Lệnh và chiến lược kiểm thử vừa đủ

```sh
cd /Users/khoadanganh/Documents/Codex/mi-cay-planner
python3 -m http.server 8765 --bind 127.0.0.1

node check.cjs
node check-worker.cjs
node check-ui.cjs
node --check app.js
node --check engine.js
node --check worker.js
git diff --check
```

Không cần build. Không thêm framework test hoặc yêu cầu tỷ lệ coverage.

### Kiểm tra bắt buộc

- Engine: thu hút, ngưỡng giá, vốn/lợi nhuận, seed tái lập, sức phục vụ/quá tải.
- Worker: kết quả khớp engine với đầu vào LV1/LV9, progress/request id/lỗi.
- Logic UI: rỗng/range/step, lọc không mất lựa chọn/giá, nội dung khuyến nghị đúng khi tăng/giảm/nhiễu/ràng buộc an toàn.
- Một lượt smoke test mobile khoảng 390px: nhập → chọn/lọc → tìm giá → đọc → dùng giá → reload. Liếc nhanh 320px để bắt tràn hoặc nút khó chạm.
- Một lượt mở desktop để xác nhận trang dùng được, không cần ma trận desktop.
- Lưu: chỉ kiểm tra auto-save/reload thông thường và việc không chặn tính nếu lưu lỗi. Không đầu tư vào hàng loạt tình huống phục hồi dữ liệu.

### Không phải điều kiện chặn hoàn thành

Không bắt buộc ma trận 6 độ rộng, thử mọi theme/zoom/hướng màn hình, kiểm thử thiết bị Safari iOS/Chrome Android thật, Lighthouse hoặc đo chỉ số web vitals. Không bắt buộc ảnh bằng chứng cho từng trạng thái UI. Giữ các kiểm tra thực đã làm làm tham khảo; không lặp lại khi không có thay đổi liên quan.

Ghi trung thực cái đã kiểm tra; không nói đã test điện thoại thật hoặc chứng minh tối ưu toàn cục khi chưa làm.

## 8. Ranh giới

- Luôn: ưu tiên mobile; validate trước tính/lưu; giữ engine/data/sample count; lỗi lưu không chặn tính; kiểm tra logic liên quan trước commit.
- Trao đổi trước: thay thuật toán/data/mục tiêu tối ưu, thêm dependency/backend/tracking hoặc tự thao tác game.
- Không: thêm import JSON, luồng phục hồi/backup phức tạp, thiết kế desktop cầu kỳ, mở rộng kiểm thử UI thành điều kiện phát hành không cần thiết, báo lưu/tính thành công khi thất bại, commit secret.

## 9. Tiêu chí nghiệm thu

- [ ] M01: Luồng nhập quán → chọn món → tìm giá → dùng giá dễ thao tác trên mobile; menu/kết quả không tràn ngang.
- [ ] M02: Giá và lựa chọn không mất khi tìm/lọc; món khóa và giá nền/topping được giải thích đúng.
- [ ] M03: Kết quả thể hiện lợi nhuận, chênh lệch, tô phục vụ, các loại mất khách và sao; không hứa tăng lời nếu bằng chứng không đủ.
- [ ] M04: Thông số hợp lệ tự nhớ khi chỉnh/tìm giá/dùng giá, reload giữ lại; lưu lỗi không cản nhập/tính.
- [ ] M05: Không import/export JSON hoặc yêu cầu phục hồi dữ liệu; cấu hình hỏng trở về mặc định và tiếp tục dùng được.
- [ ] M06: Worker và engine khớp; thuật toán, catalog và số lượt mô phỏng không bị giảm để làm UI nhanh giả.
- [ ] M07: Desktop dùng được cùng chức năng, không cần thiết kế chi tiết riêng.
- [ ] M08: Checks logic/cú pháp liên quan và smoke test mobile qua; README nêu đúng phạm vi/giới hạn.

Không có câu hỏi sản phẩm bắt buộc còn thiếu. Những yêu cầu UI/storage/test cũ trái bản này được thay thế theo chỉ đạo mới của người dùng.
