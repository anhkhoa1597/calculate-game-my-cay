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

Giữ catalog, seed và số lượt kiểm chứng; cập nhật engine theo source 2.3.8 được người dùng cho phép. Giữ hợp đồng M.validate/M.optimize/M.batch/M.simulate và bổ sung thông số chương. UI không viết một công thức lợi nhuận khác.

- Vốn tô = 1.500đ tô + 3.000đ mì + vốn nước lèo + vốn topping.
- Thu hút phụ thuộc giá mì trung bình, sao, ngày, trang bị, buzz, sự kiện và điều kiện quán.
- Giá topping không đổi xác suất chọn topping; giá cao vẫn có thể gây từ chối hoặc trừ sao.
- Mô phỏng bàn, nhóm khách, app, kiên nhẫn, nồi chạy song song, thời gian thao tác, 210 giây nhận khách và tối đa 60 giây phục vụ nốt.
- Lợi nhuận gồm vốn, phí app, tip, thuê nhà, điện/nước, điện trang bị, lương và hao hụt.
- “Tốt nhất” chỉ trong tập bảng giá đã thử, theo mục tiêu lợi nhuận một ngày; không chứng minh tối ưu toàn cục hoặc dài hạn.
- Khoảng tin cậy chỉ phản ánh ngẫu nhiên mô phỏng, không bao gồm sai số tốc độ và cơ chế chưa mô phỏng.
- Catalog 27/09/2026 đã đối chiếu không đổi trong source 2.3.8 ngày 02/10/2026. Giữ giải thích giới hạn về thiếu hàng, nhiệm vụ/thưởng, drama, giao xa, mặc cả, công thức bí truyền, du lịch, phản hồi review, lên cấp giữa ngày và phí đầu tư.
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

## Cập nhật được yêu cầu: source 2.3.8

Thêm chương 1–5, mặc định bếp nhà. Chương bị giới hạn bởi level nhưng không tự tăng theo level; cấu hình cũ thiếu chương migrate theo trần level như game, nhắc người chơi xác nhận. Bếp nhà chỉ có app, tối đa 3 đơn và hệ số nhịp 0,55; xe dạo có 2 chỗ, thu hút rain/hot ×1,15; từ chương 3 có 3 chỗ (seat4 tăng 4). Hai chương đầu không thuê; học sinh chỉ burst từ chương 2. Phí app 20% giữ nguyên.

Tách chỉ số app/khách tại quán và cho xem giá hiện tại bên cạnh đề xuất. Đối chiếu ngày 1, LV1, giá kimchi 30.000 bằng nhiều seed; 24 khách thực tế là quan sát để so sánh, không hardcode thành kết quả. Mô phỏng ca bán thông thường chưa tái hiện tô hướng dẫn đầu tiên, giao xa/drama; nói rõ để tránh hứa số khách bằng đúng một lượt chơi. Kiểm tra core gồm chương 1–5, phí/fixed, thời tiết, giới hạn công suất, migrate và Worker.

## Đối chiếu ngày 2 và khoảng tô — 02/10/2026

Người dùng yêu cầu rà lại core và thêm min–max. Giá chọn theo lợi nhuận trung bình sau chi phí. Hiển thị riêng số dự đoán theo công thức game trước mở cửa (không giới hạn sức bếp/nhịp app) và số tô thực giao trung bình; min/max phải là cực trị số tô của đúng tập 256 seed cuối, không phải CI lợi nhuận hoặc bảo đảm thực tế. Test RED trước GREEN theo skill TDD được người dùng gọi lần này. Repro ngày 2, 5 decor, kim chi 30k, 3 topping, giả định 5 sao/30 đánh giá: dự đoán game 37 và khoảng 28–29 tô trung bình có thể đồng thời đúng. Giữ phạm vi mobile gọn, không mở rộng lưu trữ.

## Bổ sung dự thảo: Nước lẩu gia truyền và so sánh các nồi

**Trạng thái: chưa duyệt; chỉ viết spec, chưa sửa code sản phẩm.** Cơ sở: audit `audits/secret-broth-2.3.9.md`. Các tiêu chí dưới đây chỉ thay giới hạn “không tính bí truyền” sau khi được duyệt và triển khai; không khẳng định bản đang chạy đã có tính năng.

### Mục tiêu và giả định

Một tính năng tính toán gia truyền: nhập hiệu ứng đang có và so sánh nồi nên làm tại menu/giá hiện tại. Tiếp tục tối ưu lợi nhuận trung bình một ngày, giữ app tĩnh/mobile/Worker, tự nhớ phụ và các chỉ số trung bình/min–max/dự đoán game.

Giả định cần người dùng duyệt:

- Tính lợi ích khi người chơi **nấu đúng**, không đoán xác suất nhớ minigame thành công.
- So sánh gia truyền trên **cùng bảng giá**, đủ nguyên liệu và tốc độ đã nhập; chưa tìm tối ưu đồng thời mọi tổ hợp nồi + giá + menu.
- Menu đang mở và phục vụ do người chơi chọn; không tự mua/mở/bỏ nước lèo.
- Không tạo bộ giải thứ tự gia vị hoặc tự thao tác game trong đợt này.

### Quy tắc tính toán

1. Mặc định không gia truyền; ngày 1–2 không cho hiệu ứng hoặc đề xuất nấu. Phạm vi chơi quán thường, không thi Giải mì/PvP.
2. Tối đa một nồi đang có hiệu ứng mỗi ngày. Đúng ngày, đã thành công, nồi có trong menu hợp lệ mới áp dụng; đổi ngày bỏ trạng thái hôm trước.
3. Nhóm hoàn tất có >=1 tô đúng nồi: cộng đúng 1 sao sau phạt và bù giá rẻ, trước clamp [1,5]. Online cũng được sao; không cộng cho đơn hủy, từng tô trước khi nhóm hoàn tất hoặc toàn bộ nồi khác.
4. Tip gia truyền = 2.000đ × số tô đúng nồi của **nhóm tại quán hoàn tất**. Không tip này cho online thường; không tính tip cho nhóm chỉ giao một phần rồi bỏ về. Không để hũ tip nhân phần thưởng gia truyền. Payday nhân tổng tip sau cùng nên phần này thành 4.000/tô. Thưởng tô sứ/mèo dùng rating đã có gia truyền; reviewer dùng rating cuối theo quy tắc nguồn.
5. Giá, vốn, xác suất gọi món/topping, tốc độ nấu và ngưỡng từ chối giữ nguyên. Gia truyền chỉ tăng thu hút gián tiếp qua lịch sử sao mới; không nhân khách thêm một hằng số và không nâng sao đầu ngày trước khi giao món.
6. Báo riêng số tô gia truyền đã giao, số nhóm thực được cộng sao và phần tip gia truyền. Không coi toàn bộ chênh lệch lợi nhuận là tip trực tiếp.
7. Tô trung bình/min–max lấy đúng số tô thực giao từng seed; dự đoán trước mở cửa vẫn theo so()/wi(), không được cộng buff sao sớm.

### Trạng thái và luồng mobile

Thêm nhóm thu gọn “Nước lẩu gia truyền hôm nay”, gồm trạng thái và nồi, cạnh thông số/menu. Trạng thái: chưa thử; đã chọn nhưng chưa đúng (còn lượt); hết lượt; đã đúng. Nồi chọn trong nước lèo đang phục vụ. Khi đã bắt đầu thử, nhắc game khóa nồi cho hôm đó; công cụ vẫn cho sửa khai báo để khớp game nhưng không tự đề xuất chuyển nồi.

Dữ liệu tối thiểu gắn ngày, không lưu kết quả/chuỗi gia vị:

```js
secret: { day: 3, broth: 'kimchi', status: 'active' }
// status: 'none' | 'locked' | 'exhausted' | 'active'; broth null khi none.
```

`active` nghĩa là đã nấu đúng; `locked` nghĩa là đã thử nhưng chưa thành công, còn lượt; `exhausted` hết lượt. Bản lưu cũ mặc định none. Giảm cấp, bỏ nồi hoặc đổi ngày: hạ trạng thái về none, báo ngắn; core cũng chặn/không áp record sai ngày, nồi khóa/topping/mã lạ. Không auto-enable hiệu ứng chỉ vì người dùng đọc đề xuất.

### Đề xuất nồi nên nấu — có điều kiện rõ ràng

- Chưa thử và ngày >=3: sau lượt tìm giá, đánh giá “không gia truyền” và từng nồi trong menu **giả định nấu đúng**, trên cùng bảng giá đề xuất, cùng 256 seed. Tối đa 10 kịch bản (none + 9 nước lèo).
- Đã chọn nhưng chưa đúng: chỉ so sánh không buff với thành công ở nồi đã khóa, không xếp hạng nồi khác. Hết lượt: không khuyên đổi nồi hôm đó. Đã đúng: tối ưu giá theo buff thực tế; so sánh none chỉ để giải thích lợi ích, không đề nghị đổi nồi.
- Bảng: tên nồi, lợi nhuận trung bình, tăng/giảm so none, tô trung bình và min–max, sao cuối ngày, tip gia truyền. Nồi thứ hạng cao nhất là tốt nhất **ở bảng giá đang so**, không phải tối ưu toàn cục.
- Có khoảng bất định của chênh lệch từ từng cặp ngày cùng seed; nếu lợi ích/khác biệt giữa hai phương án chưa rõ, ghi “chưa rõ nồi nào tốt hơn”, không buộc chốt một nồi vì chênh lệch nhỏ. Cùng seed giúp so sánh nhưng không đồng nghĩa dòng random trong các nhánh luôn giống nhau.
- Không chạy lại full optimize riêng cho 9 nồi. Nếu người chơi làm thành công nồi được gợi ý, cập nhật active và Tìm giá lại để tìm giá phù hợp buff mới. Các kịch bản giả định không ghi đè cấu hình thực tế.
- Nếu chỉ có một nồi: so none với nồi đó; không dựng bảng xếp hạng vô nghĩa. Khuyến nghị không hứa đảm bảo tăng lời hoặc tự mua thêm nước lèo.

### Kiểm thử và nghiệm thu

Dùng Node assert/node:test đang có; TDD RED trước GREEN cho logic mới. Không thêm dependency hay mục tiêu coverage mới. Tách test hiệu ứng tiền/sao xác định khỏi simulation ngẫu nhiên để bắt đúng thứ tự thưởng.

- **G01:** Record cũ/default none giữ nguyên kết quả cũ theo seed; ngày 1–2, hết lượt hoặc khác ngày không được buff; nồi chưa mở/mã topping không hợp lệ bị chặn.
- **G02:** Mỗi loại trong cả 9 nước lèo: test chạy độc lập khi đủ level, với/không buff; kiểm tra vốn từng món, fee, sao, tip, counts/min–max và profit identity. Test riêng kimchi, tomyum, tương đen, sữa phô mai, lẩu nấm, mala, tiêu xanh, gà lá é, riêu cua; không thay bằng một fixture all-menu.
- **G03:** Nhóm 1/2/3 tô gồm 0/1/2/3 tô trùng nồi; +1 sao mỗi nhóm có match (không +1 mỗi tô), chỉ match được tip, giới hạn 5 sao. Nhóm bỏ về/đơn hủy không có thưởng hoàn tất.
- **G04:** Online chỉ tăng sao, tip bí truyền 0; tại quán 2k/tô; hũ tip không nhân 2k, payday nhân đôi; kiểm tra 3→4 sao mở thưởng tô sứ/mèo và reviewer không cộng ba sao bí truyền.
- **G05:** Ma trận menu nhiều loại: các mốc cấp, đủ 9 nồi, no topping/1/đầy topping, menu màu, giá lệch giữa nồi, thấp/cao sao, nhanh/chậm/quá tải, online/tại quán/hỗn hợp; không NaN, counts và tiền khớp, không có bonus ngoài match. Không đòi exhaustive mọi tổ hợp.
- **G06:** Comparator dùng giá/seed/budget giống nhau, xếp theo lợi nhuận, báo chưa rõ khi nhiễu; đúng hạn chế nồi khóa/ngày <3; không thay đổi state sau giả lập. Min–max là 256 seed thực giao. Worker kết quả khớp engine kể cả secret config và comparator; progress/request id/lỗi vẫn đúng.
- **G07:** Smoke mobile một lượt chọn nồi/trạng thái → tính → đọc lợi ích → reload → đổi ngày. Auto-save best effort, lỗi lưu không cản tính, không mở rộng ma trận UI.
- **G08:** Đối chiếu catalog và các nhánh liên quan trong source 2.3.9 trước triển khai; giới hạn mô hình/README phải bỏ loại trừ gia truyền chỉ sau khi feature hoạt động và tests qua.

### Cấu trúc, style và lệnh

Giữ cấu trúc hiện tại: core ở `engine.js`; UI trong `app.js`/`index.html`; Worker `worker.js`; tests mới `check-secret.cjs`; mở rộng `check-worker.cjs`/`check-ui.cjs`; data/docs chỉ sửa khi có bằng chứng. Không tạo một engine lợi nhuận thứ hai. Dùng camelCase/native API; trạng thái ví dụ trên đi qua validate và snapshot Worker.

```sh
cd /Users/khoadanganh/Documents/Codex/mi-cay-planner
python3 -m http.server 8765 --bind 127.0.0.1
node --test check-secret.cjs
node check.cjs
node --test check-forecast.cjs
node check-worker.cjs
node check-ui.cjs
node --check engine.js
node --check app.js
node --check worker.js
git diff --check
```

`check-secret.cjs` là file dự kiến, chưa tồn tại ở bước spec. Không cần build.

### Ranh giới và câu hỏi còn lại

- Luôn: đối chiếu source, validate trạng thái/ngày/nồi, test tiền/sao bằng TDD, giữ UI mobile và số lượt final 256, nêu rõ kịch bản giả định cùng giá.
- Trao đổi trước: tối ưu đồng thời giá+nồi cho mọi kịch bản, tính xác suất thất bại minigame hoặc đưa bộ giải gia vị vào phạm vi.
- Không: auto nhận làm đúng, thay đổi game, auto mua/bỏ nồi, nhân khách trực tiếp do buff, cộng 2k tip online thường, coi mẫu min/max là bảo đảm.

Cần duyệt phạm vi **tính buff đã làm đúng + đề xuất nồi tại cùng bảng giá**, thay vì bộ giải minigame/tối ưu tổ hợp toàn bộ. Sau khi duyệt spec mới chuyển sang plan/tasks; chưa thực hiện các kiểm thử gia truyền hoặc thay engine trong lượt này.
